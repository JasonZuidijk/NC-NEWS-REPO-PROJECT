# NC News Seeding

Setting up .env files

Step 1, Add .env files to the root directory 
- .env.test
- .env.development

step 2, Add values to .env files to connect to the relevant databases
- In .env.test file add PGDATABASE=nc_news_test
- In .env.development file add PGDATABASE=nc_news

You can run the followinf commands in the terminal, 
"run npm test-seed" & "npm run seed-dev",
to make sure the files are correctly connected to the databases.
