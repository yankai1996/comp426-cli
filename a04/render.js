/**
 * Course: COMP 426
 * Assignment: a04
 * Author: Kai Yan
 *
 * This script uses jQuery to build an HTML page with content taken from the
 * data defined in data.js.
 */



/**
 * Given a hero object (see data.js), this function generates a "card" showing
 *     the hero's name, information, and colors.
 * @param hero  A hero object (see data.js)
 */
export const renderHeroCard = function(hero) {
    // Generate HTML elements to represent the hero
    // Return these elements as a string, HTMLElement, or jQuery object
    let year = hero.firstSeen.getFullYear();
    let month = hero.firstSeen.getMonth() + 1;
    let day = hero.firstSeen.getDay();
    return `
        <div class="column">
            <div class="card">
                <div class="card-banner" style="background-color:${hero.backgroundColor}">
                    <img src="${hero.img}">
                    <h1 class="name" style="color:${hero.color}">${hero.name}<h1>
                </div>
                <div class="card-content">
                    <h2 class="subtitle has-text-grey is-italic">"${hero.subtitle}"</h2>
                    <p><span>Alter ego:</span> ${hero.first} ${hero.last}</p>
                    <p><span>First apperance:</span> ${month}/${day}/${year}</p>
                    <p class="description">${hero.description}</p>
                    <div class="buttons">
                        <button class="button is-gray">Edit</button>
                    </div>
                </div>
            </div>
        </div>`
};



/**
 * Given a hero object, this function generates a <form> which allows the
 *     user to edit the fields of the hero. The form inputs should be
 *     pre-populated with the initial values of the hero.
 * @param hero  The hero object to edit (see data.js)
 */
export const renderHeroEditForm = function(hero) {
    // Generate HTML elements to represent the hero edit form
    // Return these elements as a string, HTMLElement, or jQuery object
    let year = hero.firstSeen.getFullYear();
    let month = hero.firstSeen.getMonth() + 1;
    let day = hero.firstSeen.getDay();

    if (month < 10) 
        month = '0' + month;
    if (day < 10) 
        day = '0' + day;

    let date = `${year}-${month}-${day}`;

    return  `
    <div class="column">
        <div class="card">
            <div class="card-banner" style="background-color:${hero.backgroundColor}">
                <img src="${hero.img}">
            </div>
            <form class="card-content">
                <div class="field">
                    <label class="label">Hero Name</label>
                    <div class="control">
                        <input class="input" value="${hero.name}">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Fisrt Name</label>
                    <div class="control">
                        <input class="input" value="${hero.first}">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Last Name</label>
                    <div class="control">
                        <input class="input" value="${hero.last}">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Subtitle</label>
                    <div class="control">
                        <input class="input" value="${hero.subtitle}">
                    </div>
                </div>
                <div class="field">
                    <label class="label">First Apperance</label>
                    <div class="control">
                        <input type="date" class="input" value="${date}">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                        <textarea class="textarea" rows="4">${hero.description}</textarea>
                    </div>
                </div>
                <br>
                <div class="buttons">
                    <button class="button is-red">Cancel</button>
                    <button class="button is-gray" type="submit">Save</button>
                </div>
            </form>
        </div>
    </div>`
};



/**
 * Given an array of hero objects, this function converts the data into HTML and
 *     loads it into the DOM.
 * @param heroes  An array of hero objects to load (see data.js)
 */
export const loadHeroesIntoDOM = function(heroes) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');

    // Generate the heroes using renderHeroCard()
    // Append the hero cards to the $root element
    for (let hero of heroes) {
        $root.append(renderHeroCard(hero));
    }
    // Pick a hero from the list at random
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];

    // Generate the hero edit form using renderHeroEditForm()
    // Append the hero edit form to the $root element
    $root.append(renderHeroEditForm(randomHero));
};



/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadHeroesIntoDOM(heroicData);
});
