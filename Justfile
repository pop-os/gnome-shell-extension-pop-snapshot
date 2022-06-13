rootdir := ''
prefix := rootdir +  '/usr/share'
gnomeextdir := prefix + '/gnome-shell/extensions'
uuid := 'pop-snapshot-notif@system76.com'

# Installs files onto the system
install:
	install -Dm0644 src/extension.js {{gnomeextdir}}/{{uuid}}/extension.js
	install -Dm0644 metadata.json {{gnomeextdir}}/{{uuid}}/metadata.json

# Uninstalls files from the system
uninstall:
	rm -rf {{gnomeextdir}}/{{uuid}}

# Removes the build folder
clean:
	rm -rf build

# Zip up the extension
zip-file:
	zip -qr {{uuid}}.zip build/*

# Enable the extension
enable:
	gnome-extensions enable {{uuid}}

# Disable the extension
disable:
	gnome-extensions disable {{uuid}}
