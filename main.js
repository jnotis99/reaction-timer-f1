let lightSeq = false;
let lightsOut = false;
let falseStart = false;
let buttonPress = false;
let start = null;
localStorage.setItem('best', "none");

$(".start").click(() => {
  if (!lightSeq && !lightsOut && !buttonPress) {
    buttonPress = true;
    lightSequence();
  }
});

function resetLights() {
  $("#1").removeClass("on");
  $("#2").removeClass("on");
  $("#3").removeClass("on");
  $("#4").removeClass("on");
  $("#5").removeClass("on");
}


function lightSequence() {
  lightSeq = true;
  pauseTime = 1000;
  pause(10, 1, falseStart).then((result) => {
    buttonPress = false;
    $(`#${result}`).addClass("on");
    return pause(pauseTime, 2, falseStart)
  }).then((result) => {
    $(`#${result}`).addClass("on");
    return pause(pauseTime, 3, falseStart)
  }).then((result) => {
    $(`#${result}`).addClass("on");
    return pause(pauseTime, 4, falseStart)
  }).then(result => {
    $(`#${result}`).addClass("on");
    return pause(pauseTime, 5, falseStart)
  }).then((result) => {
    $(`#${result}`).addClass("on");
    const outTimer = 4000 + (Math.random() * 3000);
    return pause(outTimer, null)
  }).then(() => {
    resetLights();
    lightSeq = false;
    lightsOut = true;
    // start = new Date();
    start = performance.now();
  }).catch((error) => {
    resetLights();
    falseStart = false;
    lightSeq = false;
  });
}

/**
 * 
 * @param {number} duration The length of a pause in milliseconds
 * @param {id} result The object/id to be modified based on the pause (optional)
 * @param {boolean} error Boolean representing whether there was an early start
 * @returns A promise with result as the filfilled action
 */
function pause(duration, result, error) {
  return new Promise((fulfill, reject) => {
    setTimeout(() => {
      if (!error) {
        fulfill(result);
      } else {
        reject(error);
      }
    }, duration);
  });
}

// let prevN = 0;
// if(lightsOut) {
//   setInterval((num = prevN) => {
//     $("#time").html(`time: ${num} seconds`);
//     prevN += 1;
//   }, 1)
// }

/**
 * 
 * @param {Number} start Time (in ms) when lights go out
 * @param {Number} end Time (in ms) whe
 * @returns a Promise that succeeds if both times are non-null/undefined 
 *          the result for .then(result=>{}) is the time it took for the user to click the button 
 */
function calculateTime(start, end) {
  return new Promise((fulfill, reject) => {
    if (start && end) {
      fulfill ((Math.round(end - start)) / 1000);
    } else {
      reject('cannot find both times')
    }
  })
}

function checkBestTime(prevTime) {
  bestTime = localStorage.getItem('best');
  if (bestTime === "none" || prevTime < bestTime) {
    localStorage.setItem('best', prevTime);
    $("#best-time").html(`Your best time: ${prevTime} seconds`);
  }
}

/**
 * Handles the necessary tasks (calculating time, setting best time) when the user reacts
 * @param {Number} end time at click
 */
function handleReaction(end) {
  calculateTime(start, end).then((result) => {
    lightsOut = false;
    $("#time").html(`Your time: ${result} seconds`);
    checkBestTime(result);
  });
}

/**
 * Event listener for click - only take action after "lights out"
 */
$("body").click(() => {
  const end = performance.now();
  if (lightsOut) handleReaction(end);
  else if (lightSeq && !buttonPress) {
    falseStart = true;
    $("#time").html(`False Start!`);
  }
})

/**
 * Event listener for tap (mobile) - only take action after "lights out"
 */
$("body").on("tap", () => {
  if (lightsOut) handleReaction();
})