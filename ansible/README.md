# Ansible Deployment für Hovawart Database

Dieses Ansible Setup automatisiert das Deployment der Hovawart-Züchterdatenbank auf den Produktionsserver.

## Übersicht

Das Ansible Playbook führt folgende Schritte aus:
1. ✅ Prüft und installiert Voraussetzungen (Docker, Python, etc.)
2. ✅ Erstellt Verzeichnisstruktur
3. ✅ Kopiert alle notwendigen Dateien
4. ✅ Konfiguriert Umgebungsvariablen
5. ✅ Zieht Docker Images von Docker Hub
6. ✅ Startet alle Services
7. ✅ Prüft Service-Status

## Voraussetzungen

### Auf dem Control Node (dein Rechner)
- Ansible >= 2.9 installiert
- SSH-Zugriff auf den Produktionsserver
- Docker Images bereits zu Docker Hub gepusht

```bash
# Ansible installieren (Ubuntu/Debian)
sudo apt update
sudo apt install ansible

# Prüfen
ansible --version
```

### Auf dem Production Server
- SSH-Zugriff konfiguriert
- sudo-Rechte für den deploy-user
- Root-Zugriff für Ansible

## Konfiguration

### 1. Inventory anpassen

Bearbeite `inventory/production.yml`:

```yaml
production:
  hosts:
    production-server:
      ansible_host: 192.168.1.100  # IP deines Servers
      ansible_user: root
      ansible_ssh_private_key_file: ~/.ssh/id_rsa
```

### 2. Secrets konfigurieren

Erstelle verschlüsselte Variablen:

```bash
cd ansible
make vault-create
```

Oder kopiere die Beispieldatei:

```bash
cp group_vars/production/vault.yml.example group_vars/production/vault.yml
make vault-encrypt
```

Bearbeite die verschlüsselten Variablen:

```bash
make vault-edit
```

Wichtig Variablen:
- `vault_dockerhub_user`: Dein Docker Hub Username
- `vault_postgres_password`: Sichere Datenbankpasswort
- `vault_jwt_secret`: Sehr langes zufälliges Geheimnis
- `vault_public_api_url`: Öffentliche API URL

### 3. Test Connection

```bash
make ping
```

## Deployment

### Docker Images bauen und pushen

**Wichtig:** Images müssen zuerst zu Docker Hub gepusht werden!

```bash
# Im Hauptverzeichnis
export DOCKERHUB_USER="dein-username"
./scripts/deploy-prod.sh
```

### Deployment ausführen

```bash
cd ansible
make deploy
```

Das Playbook wird nach dem Vault-Passwort fragen.

## Verfügbare Commands

```bash
make help          # Zeigt alle verfügbaren Commands
make ping          # Testet Verbindung zum Server
make check         # Prüft Playbook-Syntax
make deploy        # Führt Deployment aus
make vault-edit    # Bearbeitet verschlüsselte Variablen
make vault-create  # Erstellt neue Vault-Datei
make clean         # Bereinigt temporäre Dateien
```

## Erweiterte Nutzung

### Nur bestimmte Tasks ausführen

```bash
# Nur Docker Images pullen
ansible-playbook playbooks/deploy.yml -i inventory/production.yml \
  --tags pull --ask-vault-pass

# Nur Services neu starten
ansible-playbook playbooks/deploy.yml -i inventory/production.yml \
  --tags restart --ask-vault-pass
```

### Mit extra Variablen

```bash
ansible-playbook playbooks/deploy.yml -i inventory/production.yml \
  -e "dockerhub_user=mein-username" \
  --ask-vault-pass
```

### Verbose Output

```bash
ansible-playbook playbooks/deploy.yml -i inventory/production.yml \
  -vvv --ask-vault-pass
```

## Troubleshooting

### Connection Failed

```bash
# Teste SSH-Verbindung manuell
ssh root@192.168.1.100

# Prüfe Inventory
ansible-inventory -i inventory/production.yml --list
```

### Vault Password vergessen

```bash
# Vault neu verschlüsseln
make vault-decrypt
# Jetzt bearbeiten
make vault-encrypt
```

### Docker Images nicht gefunden

```bash
# Prüfe ob Images existieren
docker login
docker pull dein-username/hovawart-api:latest

# Prüfe Docker Hub Username in vault
make vault-edit
```

### Services starten nicht

```bash
# Prüfe Logs auf dem Server
ssh root@production-server
cd /opt/hovawart
docker-compose -f docker-compose.prod.yml -f docker-compose.traefik.yml logs -f
```

## File-Struktur

```
ansible/
├── ansible.cfg              # Ansible Konfiguration
├── Makefile                 # Convenience Commands
├── inventory/
│   └── production.yml       # Server-Liste
├── group_vars/
│   └── production/
│       └── vault.yml        # Verschlüsselte Secrets
├── playbooks/
│   ├── deploy.yml           # Haupt-Playbook
│   ├── tasks/
│   │   └── prerequisites.yml # Voraussetzungen
│   └── templates/
│       └── env.j2           # .env Template
└── README.md
```

## Sicherheit

- ✅ Secrets werden verschlüsselt gespeichert (Ansible Vault)
- ✅ SSH-Keys für Authentifizierung
- ✅ Minimale Berechtigungen
- ✅ .env wird mit 0600 Permissions erstellt

## Erweiterungen

### Backup-Task hinzufügen

Erstelle `playbooks/tasks/backup.yml`:

```yaml
- name: Create backup
  shell: |
    cd {{ app_dir }} && ./scripts/backup.sh
  become: true
  become_user: "{{ app_user }}"
```

### Updates

```bash
# 1. Code ändern und committen
# 2. Docker Images neu bauen und pushen
./scripts/deploy-prod.sh

# 3. Ansible Deployment
cd ansible
make deploy
```

## Support

Bei Problemen:
1. Prüfe Ansible Output: `-vvv` für verbose
2. Teste manuell auf dem Server
3. Prüfe Docker Logs: `docker logs <container>`
4. Prüfe Service Status: `make ping` und manuell

