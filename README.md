# ORBIT
Online Resource for Building Intercultural Teams (ORBIT) serves faculty interested in starting new online intercultural classroom or research collaborations.

#### Primary contact
[Kelly Murdoch-Kitt](mailto:kmmk@umich.edu)  
University of Michigan

#### Hosting
ORBIT runs on a simple, 1-click Docker-ready, Droplet at DigitalOcean.
The Droplet runs on project owner, Kelly Murdoch-Kitt's account.

#### Domain management
The domain http://orbit-teams.com/ points to the ORBIT Droplet (167.172.113.182). The domain is owned by Kelly and managed through [Namecheap](https://www.namecheap.com/).  

Kelly has granted Knut edit priviledges for the domain so that he can make changes to the DNS record.

#### Email delivery service
ORBIT uses [SendGrid](https://sendgrid.com/) for programmatic email delivery during password resetting.

The account (info@orbit-project.com) was created by ORBIT.

Currently usign the free plan which limits emails too 100/month.

#### Architecture
ORBIT is build with multiple Docker containers:
* Webapp (Front-end written in React, with WebPack, Sass, Babel)
* Strapi (Headless CMS providing APIs to database)
* MongoDB (NoSQL database)
* Nginx (Port forwarding and static assets)

## Production environment
SSH to ORBIT Droplet at DigitalOcean:
```
ssh root@167.172.113.182
```

#### 1. Download repository
  Create and navigate to:  
  ```
/code/orbit/
```

  Clone [ORBIT repository](https://github.com/dubberlydesign/orbit) from GitHub:
  ```
git clone https://github.com/dubberlydesign/orbit.git
```

  Afterward, the latest build can be pulled as needed:
  ```
git pull
```

#### 2. Update configuration
  Make sure the environmental variables are set.
 
  Make sure the build script is disabled in the `./strapi/Dockerfile`:  
  ```Dockerfile
21.  #RUN npm run build
```
  The Strapi Admin UI cannot be built in the production environment due to memory constrains. Instead, it must be pre-built and committed as part of the repository.

#### 3. Build containers using production settings
  While in `/code/orbit` run:
  ```
docker-compose \
-f docker-compose.yml \
-f docker-compose.production.yml \
build
```

#### 4. Start containers, run in background
While in `/code/orbit/` run:
```
docker-compose \
-f docker-compose.yml \
-f docker-compose.production.yml \
up -d
```
During start-up, the `bootstrap.js` function is executed, enabling us to make changes before the server starts.


To bring down containers:
```
docker-compose stop
```

Access the webapp here:
```
http://orbit-teams.com/
```

Access the Strapi Admin Panel here:
```
http://orbit-teams.com/api/admin
```
Credentials are defined in the `.env` file

## Development environment
#### Getting started
1. Download Docker
2. Clone GitHub repository
3. Build containers
4. Run contaiers
5. Open in browser `http://localhost/`

#### Build containers using development settings
```
docker-compose \
-f docker-compose.yml \
-f docker-compose.override.yml \
build
```
#### Run containers
```
docker-compose \
-f docker-compose.yml \
-f docker-compose.override.yml \
up
```
Hit `ctrl + c` to stop containers.

#### Develop
1. Build and run containers
2. Access Orbit in the browser.  
  Webapp served via Webpack Dev Server: http://localhost/  
  Strapi Admin Panel (credentials in .env): http://localhost/api/admin

#### Build Strapi Admin UI for production
Changes to Strapi may require rebuilding the Admin UI. Due to memory constrains in the production environemnt, this needs to be done locally, before committing the new build to the repository.

1. Navigate to Strapi folder:  
  `./strapi/`
2. Install dependencies:  
  `npm install`
3. Build Admin UI for production:  
  `NODE_ENV=production npm run build --clean`
4. Commit changes to GitHub
