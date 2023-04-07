# NodeJS container Docker

## First Version, is not finished yet :D ##

![image](https://user-images.githubusercontent.com/92930895/230559306-cee2c71d-339b-4b37-b078-08fa1c69aa07.png)


## Running on Windows (Temporal solution) ##
- First build the container:
```
docker build -t node_project_container .
```
- Then, run it:
```
docker run -it -p 3000:3000 --volume ${PWD}/app:/app --name=node_project_container --rm node_project_container
```

## Running on Linux/Mac
There are two scripts created for building and running the container. 
- First build the container:
```
./scripts/build
```
Once the container is builded, it not require any new build for code changes.
- Then, run it:
```
./scripts/run
```

## Reference:
- [How to use Docker with Node.js a step-by-step tutorial] (https://geshan.com.np/blog/2020/11/nodejs-with-docker/)
