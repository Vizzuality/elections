time lftp -c 'open -u elecciones2011,Elecc10nes rtve-004e.servidoresdns.net && mirror -RL -p --parallel=100 -I current/* /mnt/www/data data' 

