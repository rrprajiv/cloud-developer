# cloud-developer
Project (*Udagram Image Filtering Microservice*) Submission for Cloud Developer Course - Full Stack Apps on AWS

|Task                                                | Status / Remarks                                                                                  |
|----------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Clone repository to get starter code               | Completed                                                                                         |
| Setup Node environment                             | Selected the folder where starter code was cloned, to open in VS Code, installed packages (npm i) |
| Test the existing endpoint                         | The local server was started using npm run dev and endpoint localhost:8080 was accessed           |
| Created new endpoint with query parameter          | Completed                                                                                         |
| Test the new endpoint                              | Completed                                                                                         |
| Initialize Elastic Beanstalk environment           | Completed using eb init. Resuling config.yml was edited to add deploy section                     |
| Build artifact for Elastic Beanstalk deployment    | Completed using npm run build (faced issue with slash in path, resolved it using \\               |
| Create Elastic Beanstalk environment               | Completed                                                                                         |
| Test Elastic Beanstalk deployment                  | Completed                                                                                         |

**Project Submission Checklist**

|Item                                                |Remarks                                                                                                           |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| Project Code in Github repository                  |  https://github.com/rrprajiv/cloud-developer dev and master branch, master branch contains stable code           |
| Typescript typing used wherever possible           |  Tried to adhere to the guideline                                                                                |
| npm run dev runs local instance of server w/o error|  Checked                                                                                                         |
| Stubbed @TODO endpoint in server.ts completed      |  Checked                                                                                                         |
| HTTP Status codes used as apppropriate             |  Tried to adhere to the guideline                                                                                |
| Elastic Beanstalk endpoint URL                     |  Checked [Link](http://udagram-rajiv-image-filter-dev-dev.us-east-2.elasticbeanstalk.com/)                       |
| Elastic Beanstalk CLI usage                        |  Checked                                                                                                         |
|                                                    |                                                                                                                  |
|                                                    |                                                                                                                  |
|                                                    |                                                                                                                  |
|                                                    |                                                                                                                  |

** Notes **

While testing the deployed Elastic Beanstalk endpoint, some of the image URLS like https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg do not appear to work. Taking help from knowledge articles [link-1](https://knowledge.udacity.com/questions/666666), [link-2](https://knowledge.udacity.com/questions/382272), the endpoint was tested using other image urls and was found to be working. [Working-image-url-1](https://i.natgeofe.com/n/5806314f-21fe-420c-8d57-2e87254da534/Virgin%20Galactic%20flight_16x9.png?w=1200), [Working-image-url-2] (https://s.yimg.com/os/creatr-uploaded-images/2020-11/2ecd3e90-2811-11eb-bf2e-a5ff0cfc4b94)


