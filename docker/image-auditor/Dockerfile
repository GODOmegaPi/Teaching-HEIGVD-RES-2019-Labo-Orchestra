FROM node:8
MAINTAINER Olivier Liechti <olivier.liechti@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY node.js /opt/app/

CMD ["node", "/opt/app/Auditor.js"]
