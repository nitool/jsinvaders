import './style.css';

const COLOR_BG = '#282828';
let WORDS_COUNT = 2;

const slowa = [
  "jabłko", "samochód", "drzewo", "książka", "pies", "kot", "dom", "rower", "szkoła", "nauczyciel",
  "uczeń", "komputer", "mysz", "klawiatura", "okno", "drzwi", "kwiat", "krzesło", "stół", "łóżko",
  "światło", "cień", "mleko", "chleb", "masło", "ser", "pomidor", "ogórek", "ziemniak", "woda",
  "słońce", "księżyc", "gwiazda", "niebo", "deszcz", "śnieg", "wiatr", "burza", "tęcza", "zegar",
  "czas", "dzień", "noc", "tydzień", "miesiąc", "rok", "zegarek", "telefon", "telewizor", "radio",
  "gazeta", "muzyka", "film", "teatr", "gra", "zabawa", "piłka", "sport", "bieg", "skok",
  "taniec", "śpiew", "malarz", "aktor", "pisarz", "lekcja", "egzamin", "pytanie", "odpowiedź",
  "język", "słowo", "litera", "zdanie", "paragraf", "kartka", "zeszyt", "plecak", "długopis",
  "ołówek", "gumka", "linijka", "farba", "pędzel", "papier", "nożyczki", "klej", "muzeum",
  "galeria", "zoo", "las", "góry", "morze", "jezioro", "rzeka", "miasto", "wieś", "droga",
  "ulica", "most", "sklep", "kawiarnia", "restauracja", "kino", "apteka", "szpital", "biblioteka"
];

const gameContext = {
    input: '',
    selectedWord: null
}

const word = (id, content) => {
    let x = null;
    let y = Math.random() * -100;

    return {
        frame: (ctx, gameContext) => {
            ctx.font = '16px Helvetica';

            if (null === x) {
                const minWidth = ctx.measureText(content).width * 2;
                x = Math.random() * (window.innerWidth - minWidth) + minWidth;
            }

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
        const currentWordsCount = Math.round(WORDS_COUNT);
        const missingWordsCount = currentWordsCount - words.length;
        for (let i = 0; i < missingWordsCount; ++i) {
            const contentIndex = Math.floor(Math.random() * slowa.length);
            words.push(word(++wordsIndex, slowa[contentIndex]));
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
                ctx.fillStyle = 'white';
                ctx.fillRect(0, canvas.height - 200, canvas.width, 200);
                ctx.fillStyle = 'black';
                const score = parseInt((WORDS_COUNT - 2) * 10);
                ctx.fillText(score, 20, canvas.height - 20);

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

            const score = parseInt((WORDS_COUNT - 2) * 10);
            ctx.fillText(score, 20, canvas.height - 20);
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
                WORDS_COUNT += 0.2;
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

window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'Backspace': {
            event.preventDefault();
            if (event.ctrlKey) {
                gameContext.input = '';
            } else {
                gameContext.input = gameContext.input.substring(-1, gameContext.input.length - 1);
            }

            break;
        }

        case 'a':
        case 'ą':
        case 'b':
        case 'c':
        case 'ć':
        case 'd':
        case 'e':
        case 'ę':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'ł':
        case 'm':
        case 'n':
        case 'ń':
        case 'o':
        case 'ó':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 'ś':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
        case 'ź':
        case 'ż': {
            if (!event.ctrlKey) {
                event.preventDefault();
                gameContext.input += event.key;
            }

            break;
        }
    }
});
