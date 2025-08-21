import os
from pathlib import Path
from django.core.management.base import BaseCommand
from cryptography.fernet import Fernet

class Command(BaseCommand):
    help = (
        "Interactive DB configurator: prompts for ENGINE, NAME, USER, PASSWORD, HOST, PORT, "
        "and if SQL Server, asks for ODBC driver. Writes an encrypted file to configs/db_config.env "
        "and key to configs/.db_key."
    )

    def handle(self, *args, **options):
        # 1. Prompt for connection info
        engine = input("DB engine (postgresql, mysql, oracle, mssql): ").strip().lower()
        name = input("DB name: ").strip()
        user = input("DB user: ").strip()
        password = input("DB password: ").strip()
        host = input("DB host [localhost]: ").strip() or "localhost"
        port = input("DB port [leave blank for default]: ").strip()

        # 1a. If SQL Server, ask for ODBC driver
        driver = ""
        if engine in ("mssql", "sqlserver"):
            driver = input("ODBC Driver (e.g. ODBC Driver 17 for SQL Server): ").strip()

        # 2. Build the plain-text config
        cfg_lines = [
            f"ENGINE={engine}",
            f"NAME={name}",
            f"USER={user}",
            f"PASSWORD={password}",
            f"HOST={host}",
            f"PORT={port}",
        ]
        if driver:
            cfg_lines.append(f"DRIVER={driver}")

        cfg = "\n".join(cfg_lines) + "\n"

        # 3. Prepare configs folder & key
        project_root = Path(__file__).resolve().parents[3]
        self.stdout.write(self.style.NOTICE(f"Writing configs into: {project_root / 'configs'}"))
        cfg_dir = project_root / "configs"
        cfg_dir.mkdir(exist_ok=True)

        key_file = cfg_dir / ".db_key"
        if key_file.exists():
            key = key_file.read_bytes()
        else:
            key = Fernet.generate_key()
            key_file.write_bytes(key)
            self.stdout.write(self.style.NOTICE(
                f"Generated new encryption key at {key_file.relative_to(project_root)}"
            ))

        # 4. Encrypt and write the config
        fernet = Fernet(key)
        token = fernet.encrypt(cfg.encode())
        out_file = cfg_dir / "db_config.env"
        out_file.write_bytes(token)

        self.stdout.write(self.style.SUCCESS(
            f"Encrypted DB config written to {out_file.relative_to(project_root)}"
        ))
