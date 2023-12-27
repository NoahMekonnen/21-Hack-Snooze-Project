"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  // hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $favoritesList.hide()
  $ownStoriesList.hide()
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user hits the Hack or snooze link, it loads the all-stories-list */
function navAll(e){
  e.preventDefault()
  
  // hiding and showing stuff
  $allStoriesList.show()
  $loginForm.hide()
  $signupForm.hide()
  $favoritesList.hide()
  $ownStoriesList.hide()
  $addStoryform.hide()
}

$navHome.on('click', navAll)

/** When a user hit the submit, button it updates the navbar */
function navSubmit(e){
  e.preventDefault()
  $ownStoriesList.hide()
  console.log('navClick');
  navSubmit();
}

$navSubmit.on('click', navSubmit)

/** When User hits the favorites link, is the favorites-list is loaded */
function favClick(e){
  e.preventDefault();

  // clearing DOM
  $favoritesList.children().remove()

  // hiding everything
  $allStoriesList.hide();
  $addStoryform.hide();
  $loginForm.hide();
  $ownStoriesList.hide()

  
  // iterating through list of favorites from localStorage
  for (let favorite of currentUser.favorites){
    
    // making markups from the stories
    const favoriteStory = new Story(favorite)
    const favMarkup = generateStoryMarkup(favoriteStory)
    
    // adding stories to favorite-list
    favMarkup[0].children[0].checked = true
    $favoritesList.append(favMarkup);

  }
  // showing favorites
  $favoritesList.show();
}

$navFavs.on('click', favClick)

/** When the my favorites link is clicked  */
function myStoriesClick(e){
  e.preventDefault()

  // removing the existing children
  $ownStoriesList.children().remove()

  // adding stories
  for (let story of currentUser.ownStories){
    let $story = generateOwnStoryMarkup(story)
    $ownStoriesList.prepend($story)
    // favoriting stories
    for (let fav of currentUser.favorites){
      if (fav.storyId == story.storyId){
        console.log(fav)
        $story.children()[0].checked = true
      }
    }
  }
  
  // hiding and showing stuff
  $allStoriesList.hide();
  $addStoryform.hide();
  $favoritesList.hide();
  $loginForm.hide()

  $ownStoriesList.show()

}

$navMyStories.on('click', myStoriesClick)