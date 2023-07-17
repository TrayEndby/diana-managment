# What's Service
- Service is the gateway for React component to call backend apis
- Each category of component should define its service. For example: Course related components should define CourseService

# How to implement a service
AbstractService.js is the abstract class that already encapsulates implementation details for the api calls and expose functions like .get() and .post() to inherited Class

Example of implementation:
```sh
import AbstractService from './AbstractService';
class SampleService extends AbstractService {
    async test() {
        let payload = await this.post("/test", {"testKey": "testVal"});
        return payload.someReturnVal;
    }
}
```