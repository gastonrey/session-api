# Table of Contents
  - [Table of Contents](#table-of-contents)
    - [Solution and project structure](#solution-and-project-structure)
    - [The endpoints (Didn't have time to document them in a tool)](#the-endpoints-didnt-have-time-to-document-them-in-a-tool)
    - [Authentication](#authentication)
    - [Some assumptions I made](#some-assumptions-i-made)
    - [What is missing...](#what-is-missing)
    - [Additional comments](#additional-comments)
    - [How to start](#how-to-start)


## Solution and project structure

The solution I came with is a project divided in multiple modules. As you can see the idea is to separate clearly Frontend from Backend but also inside this modules i separated some stuffs like the business logic, handlers, utils, helpers and so on.
I also decided not to go for a traditional boilerplate for express js, that's why I decided to make some custome workaround such as a parser body. there is no reason just fun and learning. I have also decided not use much frameworks at all, even the front and the back are mainly using logic coded by me. i.e: the way of error handling on backend.

Briefly it contains:

 - `/app-errors` : An exported module containing the custom errors.
 - `/app-middlewares` : The middlewares used in express js.
 - `/app-utils` : Just some utils I reuse everytime I need it.
 - `/pokemons-api` : It's the API it self.
 - `/pokemons-app` : It's the frontend module (React app).

# The endpoints (Didn't have time to document them in a tool)

| Action | Method | Endpoint | Params | Body | Header |
|-|-|-|-|-|-|
| Retrieves a user | GET | `/api/users` |  |  | Authorization: jwt token |
| Registers a user | POST | `/api/users` |  | { fullname, email, password } |  |
| Retrieves the user's token | POST | `/api/sessions` |  | { email, password } |  |
| Retrieves the user's pokedex | GET | `/api/users/:userId/pokemons` | :userId |  | Authorization: jwt token |
| Add a pokemon to a user's pokedex | POST | `/api/users/:userId/pokemons` | :userId | pokemonId | Authorization: jwt token |
| Delete a pokemon from a user's pokedex | DELETE | `/api/users/:userId/pokemons` | :userId | pokemonId | Authorization: jwt token |
| Creates a pokemon | POST | `/api/pokemons` |  | { name, type, base, lang } | Authorization: jwt token |
| Retrieves a pokemon by ID | GET | `/api/pokemons/:id` | pokemonId |  | Authorization: jwt token |
| Find pokemons with filters | GET | `/api/pokemons/` | `name=&type=&limit=&page=sort=type|name` |  | Authorization: jwt token |

### Authentication

The app uses a JWT token that stores the userId. All the requering authentication have the AuthCheck handler. This simply decode the JWT, look for the user by ID and retuns the correspondant error/response, this also stores the ID in response.locals, just for conviniency when requests requering token + userId, the userId coming on params is compared against the one inside the decoded token to avoid inconsistencies.

## Some assumptions I made

Given the JSON file in the assessment I made some assumptions when modeling the data. First of all decided to go for Mongo as the database, just because it fits better for what the app was meant to be. Given this I assumed we would need to collections: Users, Pokemons. Regarding the Pokemons one I didn't went for a more complex models, it's just a plain model storing the information, for this purpose is ok but not sure if any of the pokemon's info would be better in a new schema that makes it better for reporting and aggregation with users.

Assumed as well that languages are a constant, but anyway put those constatnts in a file and if more are coming it's just about changing that file.

Regarding the language, to make it simple am just taking the user's browser configuration `window.navigator.language` . Decided not to use any module to convert codes, it's just sending the language code to backend and then it's converted to the real plain language name. Of course by default, if any language coming or unknown the default will be english.

By any reason assumed that the pokemon's creation is only present at API level but not from frontend, that's why included the endpoint but not a button to create them. So included a small script to seed with the given JSON the collections and being able to start up the app with all the pokemons for testing/development purpose. 

The filter fields at home page are an OR query, so if it's match part of the name and you obtain let say 10 results, then if you add a type filter it could match even more results.

*Last but not least*

I assumed that the JSON was an example coming from a *SQL like database, just as an example, that's why am not taking into account the `id` field coming in it. This is recreated when imported for seeding and just uses the Mongo `_id` one. At some queries when returning the document you will see I just replace the `_id` by an `id` it's just an example or a way of sanitize it. Also at some queries I serialize a little bit hidding some mongo internal fields. Would love to serialize it in a more general way before response is delibered but didn't find a way without adding a new module. If you notice some inconsistencies regarding this serializations this is more related to rush.

## What is missing...

As said before missed some stuff that would like to detail here:

 - Missed some user's feedback toast informing when something went good/wrong
 - Missed the `Sort by` field, forgot it and realized it was missing the day before delivering. Anyway the API is expecting for this field to come on searchs
 - Styling: Of course it's a little bit creepy, I just used plain HTML/CSS, no React Bootstrap/MaterialUI libraries. This made me work a little bit more but the app became more simple and light. It's need more love for sure :)
 - Normally when am developing an app use to separate configs for test/development/production, here as you can see I didn't take it into account at all, just for convinience
 - The error handling needs more love as well
 - Due to the lack of time couldn't make the API te return an object were name is just the name in the given language, so that Frontend is actually only showing the pokemons with name in english (it's just hardcoded)

## Additional comments

I just decided to add Context API instead of the typical React+Redux like app. The main reason is that I wanted to try this out.

## How to start

To make it simple the app uses Docker. At the `pokemons-app` & `pokemons-api` folders you will found the correspondant Dockerfiles, but also in the root folder there is a `docker-compose.yml` that starts up all the services together including the Mongo service.
To start this up just execute:

`docker-compose build && docker-compose up` 

This will start a fresh environment, no data at all, so to seed this project with sample data I've created a `populate.js` file that insertes the pokemons. Just go to the `/pokemons-api/data` folder and run: `node populate.js`.
*Be sure you local mongo service (if any) is not running at that time 'cause data will be inserted at the local mongo not the Docker one* 