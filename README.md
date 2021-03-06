# Make Express App

Make express app is a CLI to bootstrap new express projects.

## Installation

```bash
npm install -g make-express-app
# or 
npx make-express-app
```

## Creating an App
You’ll need to have Node 10.16.0 or later version on your local development machine. It is highly recommended using the latest LTS version.

To create a new app, you may choose one of the following methods:

#### npx

```bash
npx make-express-app -n my-app
```
_where `my-app` is the name of your project_

__note: there should no space in your project name__

After running this command, you will be prompted for some more questions, just follow it to the end, a `my-app` directory will be created 
inside the current folder. Inside that directory contains the initial project structure.

#### Global Installation
If you installed globally i.e you ran `npm install -g make-express-app`. To create a new project run the command below
```bash
make-express-app -n my-app
```

To skip all prompts and go for defaults options, run the command below.
```bash
make-express-app --yes
# or 
npx make-express-app --yes
```
_`-y` can be used in place of `--yes`_

After creating project and installation is done, you can open your project folder.
```bash
cd my-app
npm run dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)