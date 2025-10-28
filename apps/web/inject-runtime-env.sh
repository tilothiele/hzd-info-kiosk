#!/bin/sh
# Generiere eine JS-Datei mit Runtime-Variablen
cat <<EOF > /app/public/runtime-config.js
window.RUNTIME_API_URL = "${NEXT_PUBLIC_API_URL}";
EOF

# Starte Next.js
exec npm start
