'use strict';
let youTubeAPIReady = false;
let {subtitles} = {
    'subtitles': [
        {
            'begin': '0',
            'end': '20',
            'text': [
                {
                    'words': '0Hello',
                    'translate': '0привет'
                }, {
                    'words': '1Hello',
                    'translate': '1привет'
                }, {
                    'words': '2Hello',
                    'translate': '2привет'
                }
            ]
        }, {
            'begin': '21',
            'end': '31  ',
            'text': [
                {
                    'words': '9Hello',
                    'translate': '15привет'
                }, {
                    'words': 'id',
                    'translate': 'привет'
                }, {
                    'words': 'est',
                    'translate': 'привет'
                }
            ]
        }, {
            'begin': '42',
            'end': '53',
            'text': [
                {
                    'words': '11mollit',
                    'translate': 'привет'
                }, {
                    'words': 'sint',
                    'translate': 'привет'
                }, {
                    'words': 'irure',
                    'translate': 'привет'
                }
            ]
        }, {
            'begin': '65',
            'end': '68',
            'text': [
                {
                    'words': '15reprehenderit',
                    'translate': 'привет'
                }, {
                    'words': 'minim',
                    'translate': 'привет'
                }, {
                    'words': 'elit',
                    'translate': 'привет'
                }
            ]
        }, {
            'begin': '70',
            'end': '85',
            'text': [
                {
                    'words': 'ex',
                    'translate': 'привет'
                }, {
                    'words': 'cupidatat',
                    'translate': 'привет'
                }, {
                    'words': 'laborum',
                    'translate': 'привет'
                }
            ]
        }, {
            'begin': '88',
            'end': '99',
            'text': [
                {
                    'words': 'Lorem'
                }, {
                    'words': 'adipisicing'
                }, {
                    'words': 'elit'
                }
            ]
        }
    ]
};

function onYouTubeIframeAPIReady() {
    youTubeAPIReady = true;
}

function videosYouTube() {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let containerVideos = document.querySelector('#videos');
    containerVideos.addEventListener('click', (e) => {
        if (e.target.dataset.video || e.target.parentElement.dataset.video && youTubeAPIReady) {
            e.preventDefault();
            new Video(new YT.Player('video-player', {
                height: '600px',
                width: '100%',
                videoId: e.target.dataset.video || e.target.parentElement.dataset.video
            }));
        }
    });
}

class Video {
    constructor(Player) {
        this.Player = Player;
        this.text = '';
        this.init();
    }

    init() {
        this.onStateChange();
        this.translate();
        this.close();

        let videoPlayer = document.querySelector('#video-player iframe');
        let containerVideo  = document.querySelector('.container-video');

        containerVideo.style.display = 'block';
        videoPlayer.setAttribute('wmode','opaque');
    }

    translate() {
        let subtitlesContainer = document.querySelector('.subtitles');
        let subtitlesTranslate = document.querySelector('.subtitles-translate');
        subtitlesContainer.addEventListener('click', (e) => {
            subtitlesTranslate.style.display = 'block';
            if(e.target.dataset.title) {
                subtitlesTranslate.innerHTML = e.target.dataset.title;
            }
        });
    }

    onStateChange() {
        this.Player.addEventListener('onStateChange', (status) => {
            let {data} = status;
            if (data == 1) {
                this.pause = false;
                this.videoUpdate()
            }
            if (data == 2) {
                this.pause = true;
            }
        });
    }

    videoUpdate() {
        let that = this;
        this.numberPosition = this.searchSubtitles(Math.floor(this.Player.getCurrentTime()), subtitles);
        this.timerId = setTimeout(function update() {
            that.numberPosition = that.searchSubtitles(Math.floor(that.Player.getCurrentTime()), subtitles);
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
        subtitles[number].text.forEach( (elem) => {
            this.text += '<button class=\'btn-tooltip\' data-title=' + elem.translate + '>' + elem.words + '</button>';
        });
        this.updateText(true);
    }

    updateText(type) { //додає або удаляє текс якщо type = true то додаєм
        let containerText = document.querySelector('.subtitles');
        if (type) {
            containerText.innerHTML = this.text;
        } else {
            this.text = '';
            containerText.innerHTML = '';
        }
    }

    searchSubtitles(searchData, subtitles) {
        let i = 0,
            j = subtitles.length,
            k;

        while (i < j) {
            k = Math.floor((i + j) / 2);
            if (searchData <= subtitles[k].begin)
                j = k;
            else
                i = k + 1;
        }
        i === 0 ? 0: i--;
        if (subtitles[i].begin <= searchData && subtitles[i].end >= searchData)
            return i; // На выходе индекс искомого элемента.
        else
            return -1;
    }

    close() {
        let closeVideo = document.querySelector(".video-close");
        closeVideo.addEventListener('click', () => {
            this.Player.destroy();
            let containerVideo  = document.querySelector('.container-video');
            containerVideo.style.display = 'none';
        });
    }
}

class MoveElement {
    constructor(nameElement) {
        this.element = document.querySelector(nameElement);

        this.mousedown();
        this.ondragstart();
    }

    mousedown() {
        this.element.onmousedown = (e) => {
            let coords = this.getCoords(this.element);
            this.shiftX = e.pageX - coords.left;
            this.shiftY = e.pageY - coords.top;

            document.onmousemove = (e) => {
                this.moveAt(e);
            }

            this.element.onmouseup = () => {
                document.onmousemove = null;
                this.element.onmouseup = null;
            }

            this.element.onmouseout = () => {
                document.onmousemove = null;
                this.element.onmouseup = null;
            }
        }
    }

    ondragstart() {
        this.element.ondragstart = () => {
            return false;
        }
    }

    moveAt(e) {
        this.element.style.left = e.pageX - this.shiftX + 'px';
        this.element.style.top = e.pageY - this.shiftY + 'px';
    }

    getCoords() {   // кроме IE8-
        let box = this.element.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        }
    }
}

videosYouTube();
new MoveElement('.subtitles-translate');
