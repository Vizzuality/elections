lftp -c 'open -u elecciones2011,Elecc10nes rtve-004e.servidoresdns.net && mirror -R -p --parallel=100 --no-symlinks --only-newer -X tiles/ /mnt/www/data data' 