---
name: VPS Connection Manager
description: Manages SSH connections and remote commands for the BI Dashboard VPS.
---

# VPS Connection Manager

This skill provides the necessary configuration and scripts to manage the connection to the BI Dashboard VPS.

## Connection Details

- **IP Address**: `51.222.30.72`
- **Port**: `22`
- **User**: `ubuntu`
- **Private Key**: `C:\Users\Skiff\.ssh\vps_ed25519`

## Usage

### Connecting via SSH
To connect to the server, use the following command:
```powershell
ssh -i "C:\Users\Skiff\.ssh\vps_ed25519" ubuntu@51.222.30.72
```

### Running Remote Commands
To run a command on the VPS, use:
```powershell
ssh -i "C:\Users\Skiff\.ssh\vps_id_rsa" ubuntu@51.222.30.72 "your command here"
```

## Maintenance
If the key needs to be rotated, generate a new keypair and update the `authorized_keys` file on the VPS.
