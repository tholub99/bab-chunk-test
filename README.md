# babylon-chunk-testing
To run:

1. Build babylon - Navigate to `babylon-package` and run `npm i` then:

   a. `npm run build:prod` (Build with internal packaging)
  
   b. `npm run build:noch` (Build with internal packaging and no chunking)
  
   c. `npm run build:external` (Build with external packaging)
  
3. Navigate to `test-app` and run `npm i` then `npm run start`

The angular server uses port 4200
