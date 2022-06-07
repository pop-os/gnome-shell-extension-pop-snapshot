const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const Util = imports.misc.util;

const Dialog = imports.ui.dialog;
const ModalDialog = imports.ui.modalDialog;

const PopSnapshotDaemon = Gio.DBusProxy.makeProxyWrapper(
	'<node>\
		<interface name="com.system76.PopSnapshot">\
			<method name="CreateSnapshot">\
			<arg name="name" type="s" direction="in"/>\
			<arg name="description" type="s" direction="in"/>\
			<arg name="subvolumes" type="as" direction="in"/>\
			<arg type="o" direction="out"/>\
			</method>\
			<method name="FindSnapshot">\
				<arg name="uuid" type="s" direction="in"/>\
				<arg type="o" direction="out"/>\
			</method>\
			<signal name="SnapshotCreated">\
				<arg name="uuid" type="s"/>\
			</signal>\
			<signal name="SnapshotDeleted">\
				<arg name="uuid" type="s"/>\
			</signal>\
			<signal name="SnapshotRestored">\
				<arg name="uuid" type="s"/>\
				<arg name="backup_uuid" type="s"/>\
			</signal>\
			<property name="Snapshots" type="ao" access="read"/>\
		</interface>\
	</node>'
);

const PopDialog = GObject.registerClass(
	class PopDialog extends ModalDialog.ModalDialog {
		_init(_icon_name, title, description, params) {
			super._init(params);

			// NOTE: Icons were removed in 3.36
			this._content = new Dialog.MessageDialogContent({title, description});
			this.contentLayout.add(this._content);
		}
	}
);
const bus = new PopSnapshotDaemon(
	Gio.DBus.system,
	"com.system76.PopSnapshot",
	"/com/system76/PopSnapshot"
);

function reboot() {
	Util.trySpawn(["systemctl", "reboot"]);
}

function show_popup() {
	let dialog = new PopDialog(
		"dialog-warning-symbolic",
		"Snapshot Restored",
		"You should reboot your system, as you have restored your system to a snapshot, and any changes to your system you have made since then have been lost."
	);
	dialog.open();
	dialog.setButtons([
		{
			action: () => {
				dialog.close();
			},
			label: "Restart Later",
			key: Clutter.Escape,
		},
		{
			action: () => {
				dialog.close();
				this.reboot();
			},
			label: "Restart and Switch",
			key: Clutter.Enter,
		},
	]);
}

function enable() {
	bus.connectSignal("SnapshotRestored", (_proxy, _sender, args) => {
		this.show_popup();
	});
}

function disable() {}
