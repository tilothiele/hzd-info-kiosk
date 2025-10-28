#!/bin/sh
# Generiere eine JS-Datei mit Runtime-Variablen
cat <<EOF > /app/apps/web/public/runtime-config.js
window.RUNTIME_API_URL = "${NEXT_PUBLIC_API_URL}";
console.log("setting window Runtime-Config: ", window.RUNTIME_API_URL);
EOF

echo "Runtime-Config: $NEXT_PUBLIC_API_URL"

# Starte Next.js
exec npm start
