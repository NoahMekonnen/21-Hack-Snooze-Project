"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  const favoriteInput = $(`<input type = "checkbox" id = "favorite"/>`)
  favoriteInput.on('click', async function(e){
    // if checked add to favorites
    if (favoriteInput[0].checked){
      currentUser.favorites.push(story)
      await axios({
        method: "POST",
        url: `${BASE_URL}/users/${currentUser.username}/favorites/${story.storyId}`,
        data:{story:{author: story.author, url: story.url, title: story.title},token: currentUser.loginToken}
      });
    }
    // if unchecked remove from favorites
    else{
      // removing favorite
      await axios({
      method: "DELETE",
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${story.storyId}`,
      data:{story:{author: story.author, url: story.url, title: story.title},token: currentUser.loginToken}
    })

      const removedIndex = currentUser.favorites.indexOf(story)
      currentUser.favorites.splice(removedIndex,1)
    }

  })

  const generalMarkup = $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `)
    return generalMarkup.prepend(favoriteInput)
}

/**
 * A render method to render HTML for an individual Story instance of my own stories
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateOwnStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const favoriteInput = $(`<input type = "checkbox" id = "favorite"/>`)
  favoriteInput.on('click', async function(e){
    // if checked add to favorites
    if (favoriteInput[0].checked){
      // story.checked = true
      currentUser.favorites.push(story)
      await axios({
        method: "POST",
        url: `${BASE_URL}/users/${currentUser.username}/favorites/${story.storyId}`,
        data:{story:{author: story.author, url: story.url, title: story.title},token: currentUser.loginToken}
      });
    }
    // if unchecked remove from favorites
    else{
      // removing favorite
      await axios({
      method: "DELETE",
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${story.storyId}`,
      data:{story:{author: story.author, url: story.url, title: story.title},token: currentUser.loginToken}
    })
      // story.checked = false
      const removedIndex = currentUser.favorites.indexOf(story)
      currentUser.favorites.splice(removedIndex,1)
    }

  })
  // if (story.checked){

  //   favoriteInput[0].checked = true
  // }

  const removeButton = $('<button>Delete</button>')
  // remove button functionality
  removeButton.on('click', function(e){
    e.preventDefault()
    for (let story1 of storyList.stories){
      if (story1.storyId == story.storyId){
        let removedIndex1 = storyList.stories.indexOf(story1)
        storyList.stories.splice(removedIndex1,1)
      }
    }
    
    storyList.removeStory(currentUser, story.storyId)
    e.target.parentNode.remove()

    const removedIndex = currentUser.ownStories.indexOf(story)
    currentUser.ownStories.splice(removedIndex,1)
    
    for (let $story of $allStoriesList.children()){
      if ($story.id == story.storyId){
        $story.remove()
      }
    }
  })
  const hostName = story.getHostName();
  let generalMarkup = $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
    generalMarkup.prepend(favoriteInput)
    return generalMarkup.append(removeButton)
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {

    // adding stories to the story list
    const $story = generateStoryMarkup(story);
  
    $allStoriesList.append($story);
    
    // checking favorites 
    for (let fav of currentUser.favorites){
      if (fav.storyId == story.storyId){
        $story.children()[0].checked = true
      }
    }

  }

  // $allStoriesList.show();
}

function navSubmit(){
  // hiding and showing stuff
  $allStoriesList.hide()
  $addStoryform.show()
}

async function addSubmit(e){
  e.preventDefault()
  
  // add story request
  const Obj = {title: $addStoryform.children()[1].value,author: $addStoryform.children()[5].value, url: $addStoryform.children()[3].value}
  const addedStory = await storyList.addStory(currentUser, Obj)

  // adding to all stories
  const $story = generateStoryMarkup(addedStory)
  $allStoriesList.prepend($story)
  
  // adding to own stories
  const $story1 = generateOwnStoryMarkup(addedStory)
  $ownStoriesList.prepend($story1)
  currentUser.ownStories.push(addedStory)
  storyList.stories.unshift((new Story(addedStory)))
  

  // reset form
  $addStoryform[0].reset()

  // hiding and showing stuff
  $addStoryform.hide()
  $favoritesList.hide()
  $loginForm.hide()
  $allStoriesList.show()
}


$storyButton.on("click", addSubmit);