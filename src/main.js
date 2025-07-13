import './style.css';

const COLOR_BG = '#282828';
const WORDS_COUNT = 2;

const gameContext = {
    input: '',
    selectedWord: null
}

const word = (id, content) => {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * -100;

    return {
        frame: (ctx, gameContext) => {
            ctx.font = '16px Helvetica';
            let textToRender = content;
            let offset = 0;
            if (gameContext.selectedWord === id 
                && content.startsWith(gameContext.input)
            ) {
                const replace = new RegExp(`^${gameContext.input}`);
                textToRender = textToRender.replace(replace, '');
                offset = ctx.measureText(gameContext.input).width;
                ctx.fillStyle = 'red';
                ctx.fillText(gameContext.input, x, y);
            }

            ctx.fillStyle = 'white';
            ctx.fillText(textToRender, x + offset, y);
        },

        update: () => {
            y++;
        },

        id: id,
        content: content,
        x: () => x,
        y: () => y
    };
}

const invaders = () => {
    const canvas = document.getElementById('jsinvaders');
    const ctx = canvas.getContext('2d');
    let wordsIndex = 0;
    let words = [];
    let ok = true;

    const fillWords = () => {
        const missingWordsCount = WORDS_COUNT - words.length;
        for (let i = 0; i < missingWordsCount; ++i) {
            words.push(word(++wordsIndex, 'testowe'));
        }
    }

    const onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    return {
        frame: () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = COLOR_BG;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (!ok) {
                return;
            }

            for (let word of words) {
                word.frame(ctx, gameContext);
            }

            const inputDims = ctx.measureText(gameContext.input);
            const start = (canvas.width / 2) - (inputDims.width / 2);

            ctx.fillStyle = 'white';
            ctx.fillRect(0, canvas.height - 200, canvas.width, 200);
            ctx.fillStyle = 'black';
            ctx.fillText(gameContext.input, start, canvas.height - 100);
        },

        update: () => {
            if (!ok) {
                return;
            }

            let selectedWord = null;

            for (let word of words) {
                word.update();

                if (
                    gameContext.input.length > 0
                    && (selectedWord === null || selectedWord.y() < word.y())
                    && word.content.startsWith(gameContext.input)
                ) {
                    selectedWord = word;
                }

                if (word.y() > canvas.height - 200) {
                    ok = false;
                    alert('no i koniec');
                    break;
                }
            }

            if (!ok) {
                return;
            }

            if (null !== selectedWord 
                && gameContext.input === selectedWord.content
            ) {
                gameContext.input = '';
                words = words.filter((word) => word.id !== selectedWord.id);
            } else if (null !== selectedWord) {
                gameContext.selectedWord = selectedWord.id;
            } else {
                gameContext.selectedWord = null;
            }

            fillWords();
        },

        init: () => {
            onResize();
            window.addEventListener('resize', onResize);
            fillWords();
        }
    };
}

const game = invaders();
game.init();

const frame = () => {
    game.frame();
    game.update();
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

window.addEventListener('keyup', event => {
    if (event.ctrlKey && event.key === 'Backspace') {
        gameContext.input = '';
    } else if (event.key === 'Backspace') {
        gameContext.input = gameContext.input.substring(-1, gameContext.input.length - 1);
    } else if (/^[a-z]$/.test(event.key)) {
        gameContext.input += event.key;
    }
});
