rm -rf /home/ubuntu/election_deploy
cp -R /home/ubuntu/election /home/ubuntu/election_deploy
rm -rf /home/ubuntu/election_deploy/.git
lftp -e 'mirror -R -p --parallel=100 --no-symlinks /home/ubuntu/election_deploy/. .' -u elecciones2011,Elecc10nes rtve-004e.servidoresdns.net
rm -rf /home/ubuntu/election_deploy