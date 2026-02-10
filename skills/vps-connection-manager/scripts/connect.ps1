$keyPath = "C:\Users\Skiff\.ssh\vps_ed25519"
$user = "ubuntu"
$ip = "51.222.30.72"

ssh -i $keyPath "$user@$ip"
