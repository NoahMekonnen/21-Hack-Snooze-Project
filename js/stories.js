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
  favoriteInput.on('click', function(e){
    // if checked add to favorites
    if (favoriteInput[0].checked){
      currentUser.favorites.push(story)
    }
    // if unchecked remove from favorites
    else{
      for (let markup of $allStoriesList.children()){
        if (markup.id == e.target.parentNode.id){
          markup.children[0].checked = false
        }
      }

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

function generateOwnStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const removeButton = $('<button>Delete</button>')
  // remove button functionality
  removeButton.on('click', function(e){
    e.preventDefault()

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
    // console.log($story)
    $allStoriesList.append($story);

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

  // reset form
  $addStoryform[0].reset()

  // hiding and showing stuff
  $addStoryform.hide()
  $favoritesList.hide()
  $loginForm.hide()
  $allStoriesList.show()
}


$storyButton.on("click", addSubmit);