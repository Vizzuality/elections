rm -rf /home/ubuntu/elections_deploy
cp -R /home/ubuntu/elections /home/ubuntu/elections_deploy
rm -rf /home/ubuntu/elections_deploy/.git
lftp -c 'mirror -R -p --parallel=100 --no-symlinks /home/ubuntu/elections_deploy/. .' -u elecciones2011,Elecc10nes rtve-004e.servidoresdns.net
rm -rf /home/ubuntu/elections_deploy