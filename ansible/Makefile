.PHONY: help deploy check ping vault-edit

help:
	@echo "Available commands:"
	@echo "  make ping          - Test connection to production server"
	@echo "  make check         - Check playbook syntax"
	@echo "  make deploy        - Deploy to production"
	@echo "  make vault-edit    - Edit encrypted variables"
	@echo "  make vault-create  - Create new vault file"
	@echo "  make vault-encrypt - Encrypt vault file"
	@echo "  make vault-decrypt - Decrypt vault file"
	@echo ""
	@echo "Vault Password File:"
	@if [ -f vault-password-file.sh ] && [ -x vault-password-file.sh ]; then \
		echo "  ✅ vault-password-file.sh exists"; \
	else \
		echo "  ⚠️  vault-password-file.sh not found or not executable"; \
		echo "     Creating template..."; \
	fi

ping:
	@if [ -f vault-password-file.sh ] && [ -x vault-password-file.sh ]; then \
		ansible production -i inventory/production.yml -m ping --vault-password-file=vault-password-file.sh; \
	else \
		ansible production -i inventory/production.yml -m ping --ask-vault-pass; \
	fi

check:
	ansible-playbook --syntax-check playbooks/deploy.yml

deploy:
	@if [ -f vault-password-file.sh ] && [ -x vault-password-file.sh ]; then \
		ansible-playbook playbooks/deploy.yml -i inventory/production.yml --vault-password-file=vault-password-file.sh; \
	else \
		ansible-playbook playbooks/deploy.yml -i inventory/production.yml --ask-vault-pass; \
	fi

vault-edit:
	@if [ -f vault-password-file.sh ] && [ -x vault-password-file.sh ]; then \
		ansible-vault edit group_vars/production/vault.yml --vault-password-file=vault-password-file.sh; \
	else \
		ansible-vault edit group_vars/production/vault.yml; \
	fi

vault-create:
	@if [ -f vault-password-file.sh ] && [ -x vault-password-file.sh ]; then \
		ansible-vault create group_vars/production/vault.yml --vault-password-file=vault-password-file.sh; \
	else \
		ansible-vault create group_vars/production/vault.yml; \
	fi

vault-encrypt:
	@if [ -f vault-password-file.sh ] && [ -x vault-password-file.sh ]; then \
		ansible-vault encrypt group_vars/production/vault.yml --vault-password-file=vault-password-file.sh; \
	else \
		ansible-vault encrypt group_vars/production/vault.yml; \
	fi

vault-decrypt:
	@if [ -f vault-password-file.sh ] && [ -x vault-password-file.sh ]; then \
		ansible-vault decrypt group_vars/production/vault.yml --vault-password-file=vault-password-file.sh; \
	else \
		ansible-vault decrypt group_vars/production/vault.yml; \
	fi

clean:
	find . -name "*.retry" -delete
	rm -rf /tmp/ansible_facts/

