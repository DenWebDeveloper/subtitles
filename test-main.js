let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let {subtitles} = {
  "subtitles": [
    {
      "begin": "0",
      "end": "20",
      "text": [
        {
          "words": "0Hello",
          "translate": "0привет"
        }, {
          "words": "1Hello",
          "translate": "1привет"
        }, {
          "words": "2Hello",
          "translate": "2привет"
        }
      ]
    }, {
      "begin": "21",
      "end": "31  ",
      "text": [
        {
          "words": "9Hello",
          "translate": "15привет"
        }, {
          "words": "id",
          "translate": "привет"
        }, {
          "words": "est",
          "translate": "привет"
        }
      ]
    }, {
      "begin": "42",
      "end": "53",
      "text": [
        {
          "words": "11mollit",
          "translate": "привет"
        }, {
          "words": "sint",
          "translate": "привет"
        }, {
          "words": "irure",
          "translate": "привет"
        }
      ]
    }, {
      "begin": "65",
      "end": "68",
      "text": [
        {
          "words": "15reprehenderit",
          "translate": "привет"
        }, {
          "words": "minim",
          "translate": "привет"
        }, {
          "words": "elit",
          "translate": "привет"
        }
      ]
    }, {
      "begin": "70",
      "end": "85",
      "text": [
        {
          "words": "ex",
          "translate": "привет"
        }, {
          "words": "cupidatat",
          "translate": "привет"
        }, {
          "words": "laborum",
          "translate": "привет"
        }
      ]
    }, {
      "begin": "88",
      "end": "99",
      "text": [
        {
          "words": "Lorem"
        }, {
          "words": "adipisicing"
        }, {
          "words": "elit"
        }
      ]
    }
  ]
}
var status = false;
function onYouTubeIframeAPIReady(videoId) {
  // new Video(new YT.Player('33333333333', {
  //   height: '600px',
  //   width: '100%',
  //   videoId: videoId
  // }))
    status = true;
}

function videosYouTube() {
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let containerVideos = document.querySelector("#videos");
    containerVideos.addEventListener('click', (e) => {
        if(e.target.dataset.video) {
            onYouTubeIframeAPIReady(e.target.dataset.video);
        }
    });
}

class Video {
  constructor(Player) {
    this.Player = Player;
    this.text = "";
      this.init();
      this.event();
  }

  init() {
    this.onStateChange();
    this.videoUpdate();
      }

  event() {
      let subtitlesContainer = document.querySelector(".subtitles-container");
      let translateContainer = document.querySelector(".translate-container");
      subtitlesContainer.addEventListener("click", (e) => {
         if(e.target.dataset.title) {
             translateContainer.innerHTML = e.target.dataset.title;
         }
      });
  }

  onStateChange() {
    this.Player.addEventListener('onStateChange', (status) => {
      let {data} = status;
      if (data == 1) {
        this.pause = false;
        this.videoUpdate()
      };
      if (data == 2) {
        this.pause = true;
      };
    });
  }

  videoUpdate() {
    let that = this;
    this.numberPosition = this.binarySearch(Math.floor(that.Player.getCurrentTime()), subtitles);
    this.timerId = setTimeout(function update() {
      that.numberPosition = that.binarySearch(Math.floor(that.Player.getCurrentTime()), subtitles);
      console.log(that.numberPosition);
      that.numberPosition !== -1
        ? that.generateText(that.numberPosition)
        : that.updateText(false);
      if (!that.pause) {
        that.timerId = setTimeout(update, 500);
      }
    }, 500);
  }

  generateText(number) {
    this.updateText(false);
    subtitles[number].text.forEach(elem => {
          this.text += "<button class=\"btn-tooltip\" data-title=" + elem.translate + ">" + elem.words + "</button>";
    });
    this.updateText(true);
  }
//  не забути додати wmode="opaque"> до фрейма ютуба
  updateText(type) { //додає або удаляє текс якщо type = true то додаєм
    let containerText = document.querySelector(".subtitles-container");
    if (type) {
      containerText.innerHTML = this.text;
    } else {
      this.text = "";
      containerText.innerHTML = "";
    }
  }

  binarySearch(searchData, json) {
    var i = 0,
      j = json.length,
      k;

    while (i < j) {
      k = Math.floor((i + j) / 2);
      if (searchData <= json[k].begin)
        j = k;
      else
        i = k + 1;
      }
    i == 0? 0: i--;
    console.log(i)
    if (json[i].begin <= searchData && json[i].end >= searchData)
      return i; // На выходе индекс искомого элемента.
    else
      return -1;
    }
  }

class Tooltip  {
    constructor(className) {
        this.className = className || ".btn-tooltip";
        this.event();
    }

    event() {
        let subtitlesContainer = document.querySelector(".subtitles-container");
        subtitlesContainer.addEventListener("mouseover", (e) => {
            let tooltipTranslate = document.querySelectorAll(".tooltip-translate");
            for(let i = 0; i < tooltipTranslate.length; i++) {
                tooltipTranslate[i].style.display = "none";
            }
            if(e.target.classList.contains("btn-tooltip")) {
                e.target.parentElement.querySelector(".tooltip-translate").style.display = "block";
            }
        });

    }
}


var ball = document.querySelector('.translate-container');

ball.onmousedown = function(e) {

    var coords = getCoords(ball);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    ball.style.position = 'absolute';
    document.body.appendChild(ball);
    moveAt(e);

    ball.style.zIndex = 9999999999; // над другими элементами

    function moveAt(e) {
        ball.style.left = e.pageX - shiftX + 'px';
        ball.style.top = e.pageY - shiftY + 'px';
    }

    document.onmousemove = function(e) {
        moveAt(e);
    };

    ball.onmouseup = function() {
        document.onmousemove = null;
        ball.onmouseup = null;
    };

}

ball.ondragstart = function() {
    return false;
};

function getCoords(elem) {   // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };


}