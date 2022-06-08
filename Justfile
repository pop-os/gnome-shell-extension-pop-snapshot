rootdir := ''
prefix := rootdir +  '/usr/share'
gnomeextdir := prefix + '/gnome-shell/extensions'
uuid := 'pop-snapshot-notif@system76.com'

all:
	mkdir build
	cp src/extension.js build/extension.js
	cp metadata.json build/metadata.json

# Installs files onto the system
install:
	install -dm0644 build {{gnomeextdir}}/{{uuid}}

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
