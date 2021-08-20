document.addEventListener('DOMContentLoaded', () => {
    const grid=document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const H_ScoreDisplay = document.querySelector('#H-score')
    const LinesDisplay = document.querySelector('#lines')
    const Line_h3 = document.querySelector('#line-h3')
    const Level_h3 = document.querySelector('#level-h3')
    const LevelDisplay = document.querySelector('#level')
    const StartBtn = document.querySelector('#start-button') //GetElementByID
    const RestartBtn = document.querySelector('#restart-button')
    // sounds
    var son = document.getElementById("myAudio")
    var fall = document.getElementById("fall")
    var LineCLR = document.getElementById("LineCLR")
    var Tetris_Sound = document.getElementById("Tetris_Sound")
    var LevelUp = document.getElementById("LevelUp")
    var Pause_sound = document.getElementById("sound")
    var GameOver_sound = document.getElementById("GO_sound")
    var rotate_sound = document.getElementById("rotate_sound")
    // wfa l sound
    const width =10
    let nextRandom=-1
    let timerId
    let score = 0
    let Hscore = localStorage.getItem("Hs")
    console.log(Hscore)
    let linesrem=0
    let reach=0
    let lines = 0
    let over = 0
    let level = 0
    let speed = 1000
    let bag_choices= [0,1,2,3,4,5,6]
    const colors = [
        'url(Blocks/I.png)',
        'url(Blocks/O.png)',
        'url(Blocks/T.png)',
        'url(Blocks/S.png)',
        'url(Blocks/J.png)',
        'url(Blocks/Z.png)',
        'url(Blocks/L.png)'
    ]
    //drawing the tetrominoes
    const jTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const sTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const zTetromino = [
        [0, width, width -1 , width * 2 - 1],
        [width , width + 1, -1, 0],
        [0, width, width -1 , width * 2 - 1],
        [width , width + 1, -1, 0],
    ]

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 0],
        [width, width + 1, width + 2, 2],
        [1, width + 1, width * 2 + 1, width * 2 +2],
        [width*2, width , width  + 1, width + 2]
    ]

    /*const newww = [
        [1, width + 1, width * 2 + 1, 0,width+2],
        [width, width + 1, width + 2, 2,width*2 +1],
        [1, width + 1, width * 2 + 1, width * 2 +2,width],
        [width*2, width , width  + 1, width + 2,1]
    ]*/



    
    if (Hscore != null ){
    H_ScoreDisplay.innerHTML=Hscore
    localStorage.setItem("Hs",Hscore)
    }

    if (sessionStorage.getItem("SS")!=null){
        //console.log(sessionStorage.getItem("SS"))
        if (sessionStorage.getItem("SS") == 1){son.muted=true}
        else{
            son.muted=false
           // console.log("FALSE")
        }
    }
    else{sessionStorage.setItem("SS",0)}

    console.log(sessionStorage.getItem("SS"))

    const theTetrominoes=[iTetromino,oTetromino,tTetromino,sTetromino,lTetromino,zTetromino,jTetromino]

    let currentPosition=4
    let currentRotation=Math.floor(Math.random()*4)


    function rand7 (){
        let x=bag_choices[Math.floor(Math.random()*bag_choices.length)]
        bag_choices.splice(bag_choices.indexOf(x),1)
        if (bag_choices.length === 0){bag_choices= [0,1,2,3,4,5,6]}
        //console.log(x)
        //console.log(bag_choices)
        return x
    }


    // choose random from 7 
    let random = rand7()

    //console.log(random)

    let current= theTetrominoes[random][currentRotation]

    //draw
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].classList.add('moving')
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    }

    
    //undraw

    function undraw(){
        squares.forEach(square => {
            square.classList.remove('tetromino')
            square.classList.remove('moving')
            if (!square.classList.contains('taken')){square.style.backgroundImage = 'none'}
        })
    }

    //move down
    //timerId = setInterval(moveDown, 500)


    $(document).keydown(function(){
        if (timerId){
        if (event.which === 37){moveleft()}
        else if(event.which === 39){
            moveright()
        }
        else if(event.which === 38){
            rotate()
        }
        else if (event.which === 40){moveDown()}
        else if (event.which === 32){
            while (reach ===0){
                moveDown()
            }
            reach=0
        }}
        if (event.which === 80){if (over === 0 ){StartBtn.click()}} 
        else if (event.which === 77){ //77 hiya m
            if (son.muted) {
                son.muted=false
                sessionStorage.setItem("SS",0)
                console.log(sessionStorage.getItem("SS"))

            }
            else {
                son.muted=true
                sessionStorage.setItem("SS",1)
                console.log(sessionStorage.getItem("SS"))

            }
        }
        else if (event.which === 82){  // 82 = R
            RestartBtn.click()
        }
        else if (event.which === 109){
            localStorage.setItem("Hs", score)
            Hscore=score
            H_ScoreDisplay.innerHTML=Hscore
            //console.log(localStorage.getItem("Hs"))

        }

    
    })


    function moveDown(){
        freeze()
        undraw()
        currentPosition += width
        draw()
        //console.log(current)   
    }

    //stop moving reach block
    function freeze(){

        if (current.some(index => squares[currentPosition + index +width].classList.contains('taken'))){
            // reach just lil space bar
            reach=1
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            current.forEach(index => squares[currentPosition + index].classList.remove('tetromino'))
            current.forEach(index => squares[currentPosition + index].classList.remove('moving'))
            //wa7id jdid
            random=nextRandom
            nextRandom = rand7()
            currentRotation=Math.floor(Math.random()*4)
            current=current= theTetrominoes[random][currentRotation]
            currentPosition=4
            draw()
            displayShape()
            addScore()
            gameOver()
            if (sessionStorage.getItem("SS") == 0){fall.play()}
        }
    }

    //move 3al isar 
    function moveleft(){
        //console.log("moving left")
        undraw()
        const isAtLeft = current.some(index => (currentPosition + index)% width === 0)

        if (!isAtLeft) currentPosition-=1

        if (current.some(index => squares[currentPosition+ index].classList.contains('taken'))){currentPosition+=1}
        draw()
    }

    
    //move 3al imin
    function moveright(){
        //console.log("moving right")
        undraw()
        const isAtRight = current.some(index => (currentPosition + index)% width === width-1)

        if (!isAtRight) currentPosition+=1

        if (current.some(index => squares[currentPosition+ index].classList.contains('taken'))){currentPosition-=1}
        draw()
    }

    // rotating
    function rotate(){
    undraw()
    
    let rot = (current.some(index => (currentPosition + index)%width <3 ) &&
    theTetrominoes[random][(currentRotation+1)%4].some(index => (currentPosition + index)%width >7 ) ||
    ((current.some(index => (currentPosition + index+1)%width >7)) &&
    theTetrominoes[random][(currentRotation+1)%4].some(index => (currentPosition + index)%width <3 )))

    console.log(rot)
    if (!rot &&   !theTetrominoes[random][(currentRotation+1)%4].some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentRotation=(currentRotation+1)%4
        if (sessionStorage.getItem("SS") == 0){rotate_sound.play()}
    }
    current = theTetrominoes[random][currentRotation]
    draw()
    }

    //////////////////////////////mini "next" grid 

    const displaySquares = document.querySelectorAll('.mini div')
    const displayWidth = 4
    let displayIndex = 0
    //console.log(displaySquares)

    const upnext = [
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // I
    [displayWidth+1,displayWidth+ 2, displayWidth*2+1, displayWidth*2 + 2],           //O
    [1+displayWidth, displayWidth*2, displayWidth*2 + 1, displayWidth*2 + 2],    //T
    [1, 1+displayWidth, displayWidth + 2, displayWidth * 2 + 2], //S
    [1, displayWidth + 1, displayWidth * 2 + 1, 2] ,      // L
    [2, displayWidth+2, displayWidth+1  , displayWidth * 2 +1], //Z
    [displayWidth*2, displayWidth , displayWidth  + 1, displayWidth + 2]

    ]

    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundImage = 'none'
        })
        
        upnext[nextRandom].forEach(index => {
            displaySquares[index].classList.add('tetromino')
            displaySquares[index].style.backgroundImage = colors[nextRandom]
        })
    }

    /////// add buttons 
    StartBtn.addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId)
            timerId=null
            son.pause()
            StartBtn.innerHTML="unpause"
            if (sessionStorage.getItem("SS") == 0){pause.play()}

        }else {
            StartBtn.innerHTML="Pause"
            son.play()
            son.volume = 0.2
            draw()
            timerId= setInterval(moveDown,speed)
            if (nextRandom ===-1){
                nextRandom = rand7()
            }
            else{
                if (sessionStorage.getItem("SS") == 0){pause.play()}
            }
            displayShape()
        }
        $(StartBtn).blur() 
    })


    RestartBtn.addEventListener('click', () => {
        location.reload()
    })

    // score counting
    function addScore(){
        for (let i = 0; i<199;i+=width) {
            const row = [i , i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if(row.every(index => squares[index].classList.contains('taken'))){
                linesrem += 1
                
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundImage = 'none'
                })
                const squaresRemoved = squares.splice(i, width)
                //console.log(squaresRemoved)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))

            }

        }
        if (linesrem > 0 && linesrem < 4) {if (sessionStorage.getItem("SS") == 0){LineCLR.play()}}
        if (linesrem === 4) {if (sessionStorage.getItem("SS") == 0){Tetris_Sound.play()}}
        if (linesrem === 1 ){score += (level+1)*40}
        else if (linesrem ===2 ){score += (level+1)*100}
        else if (linesrem === 3){score += (level+1)*300}
        else if (linesrem ===4){score += (level+1)*1200}
        ScoreDisplay.innerHTML = score
        lines+=linesrem
        LinesDisplay.innerHTML = lines
        linesrem=0
        if (level < Math.floor(lines/10)){
            son.volume = 0.1
            if (sessionStorage.getItem("SS") == 0){LevelUp.play()}
            son.volume= 0.2
        }
        level =  Math.floor(lines/10)
        LevelDisplay.innerHTML = level
        if (score>Hscore){
            Hscore=score
            H_ScoreDisplay.innerHTML=Hscore
            localStorage.setItem("Hs",Hscore);
        }
        speedup()

    }
    
    function speedup(){
        let SQ
        if (level===0){SQ = 48}
        if (level===1){SQ = 43}
        if (level===2){SQ = 38}
        if (level===3){SQ = 33}
        if (level===4){SQ = 28}
        if (level===5){SQ = 23}
        if (level===6){SQ = 18}
        if (level===7){SQ = 13}
        if (level===8){SQ = 8}
        if (level===9){SQ = 6}
        if (level>9 && level < 13){SQ = 5}
        if (level>12 && level <16){SQ = 4}
        if (level>15 && level <19){SQ = 3}
        if (level>18 & level <29){SQ = 2}
        if (level>28){SQ = 1}
        speed=SQ*1000/48
        //console.log(SQ)
        //console.log(speed)
        if (SQ<18){SQ=18}
        son.playbackRate = 48/SQ
        clearInterval(timerId)
        timerId= setInterval(moveDown,speed)
    }



    //game over

    function gameOver(){
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            ScoreDisplay.innerHTML = score +' Game over, Level= ' + level
            Level_h3.style.display= "none"
            Line_h3.style.display = "none"
            clearInterval(timerId)
            timerId=null
            StartBtn.style.display="none"
            RestartBtn.style.display="block"
            son.muted=true
            over = 1
            if (sessionStorage.getItem("SS") == 0){GameOver_sound.play()}
        }
    }
})