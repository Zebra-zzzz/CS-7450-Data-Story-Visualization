let mData;
const myRe = /[\w-]+/g;

// let numNodes = 100
// let nodes = d3.range(numNodes).map(function (d) {
//     return { radius: Math.random() * 25, category: Math.floor(Math.random() * 3) }
// })

// using d3 for convenience
let main = d3.select("main");
let scrolly = main.select("#scrolly");
let svg = scrolly.select("svg");
let article = scrolly.select("article");
let step = article.selectAll(".step");

let highlight = false;

const svgHeight = window.innerHeight/1.2;
const svgMarginTop = (window.innerHeight - svgHeight) / 2;
// const svgWidth = window.innerWidth - 15*16;
const svgWidth = window.innerWidth - 25*16;


const maxSpHeight = window.innerHeight/1.8;
const spWidth = window.innerWidth - 50*16;

let nodeGroup = svg.append('g')
    .attr('class', 'nodeGroup') 

let barGroup = svg.append('g')
    .attr('class', 'barGroup')
    .attr('transform', 'translate(' + (svgWidth - spWidth)/2 + ',' + (svgHeight - maxSpHeight)/2 + ')')


let spGroup = svg.append('g')
    .attr('class', 'spGroup')
    .attr('transform', 'translate(' + (svgWidth - spWidth)/2 + ',' + (svgHeight - maxSpHeight)/2 + ')')

let annotation1 = svg.append('text')
    .style('visibility', 'hidden')

let annotation2 = svg.append('text')
    .style('visibility', 'hidden')

let annotation3 = svg.append('text')
    .style('visibility', 'hidden')

let digitMovies = ['1911', '42']

// initialize the scrollama
let scroller = scrollama();

d3.csv("./movies.csv",
// Preprocessing dataset, for movies with more than one genres, randomly pick one genre
    function(d) {
        var genresArray = [...d.genres.matchAll(myRe)];
        return {title: digitMovies.includes(d.movie_title)? d.movie_title: d.movie_title.slice(0, d.movie_title.length-2), genre: genresArray[0]['0'], gross: d.gross, budget: d.budget, roi: (d.gross-d.budget)/d.budget, content_rating: d.content_rating, country: d.country, director: d.director_name, actor: d.actor_1_name, duration: d.duration, imdb: d.imdb_score, likes: d.movie_facebook_likes, year: d.title_year}
        return {title: d.movie_title, genre: genresArray[0]['0'], gross: d.gross, budget: d.budget, roi: (d.gross-d.budget)/d.budget, content_rating: d.content_rating, country: d.country, director: d.director_name, actor: d.actor_1_name, duration: d.duration, imdb: d.imdb_score, likes: d.movie_facebook_likes, year: d.title_year}
        // return {title: d.movie_title, genre: genresArray[Math.floor(Math.random() * genresArray.length)]['0'], gross: d.gross, content_rating: d.content_rating, country: d.country, director: d.director_name, duration: d.duration, imdb: d.imdb_score, likes: d.movie_facebook_likes, year: d.title_year}
        // return {genre: [...d.genres.matchAll(myRe)][0]['0']}
    }).then(function (data) {
    // ).then(function (data) {
    // Remove the datapoints missing essential properties
    mData = data.filter(function(d) {
        // return d['genre']
        return d['content_rating'] && d['country'] && d['director'] && d['actor'] && d['duration'] && d['genre'] && d['gross'] && d['budget'] && d['roi'] && d['imdb'] && d['likes'] && d['title'] && d['year']
        // return !d['content_rating'] || !d['country'] || !d['director_name'] || !d['duration'] || !d['genres'] || !d['gross'] || !d['imdb_score'] || !d['movie_facebook_likes'] || !d['movie_title'] || !d['title_year']
    })
    
    // console.log(mData);
    // console.log(data);
    // console.log(mData[8].title.slice(-2) === 'Â')

    // -------------------------------------------- Genre data processing
    var average = d3.rollup(mData, v => d3.sum(v, d => d.gross)/v.length, d => d.genre);
    var averageArray = Array.from(average, function(item) {
        return {genre: item[0], avgGross: item[1]}
    });
    averageArray = averageArray.slice().sort((a, b) => d3.descending(a.avgGross, b.avgGross));

    var averageROI = d3.rollup(mData, v => d3.sum(v, d => d.roi)/v.length, d => d.genre);
    var averageROIArray = Array.from(averageROI, function(item) {
        return {genre: item[0], avgROI: item[1]}
    });
    averageROIArray = averageROIArray.slice().sort((a, b) => d3.descending(a.avgROI, b.avgROI));
    

    var genreCount = d3.rollup(mData, v => v.length, d => d.genre);
    var genreCountArray = Array.from(genreCount, function(item) {
        return {genre: item[0], count: item[1]}
    });
    genreCountArray = genreCountArray.slice().sort((a, b) => d3.descending(a.count, b.count));

    var genreArray = Array.from(genreCountArray, function(item) {
        return item.genre
    });


    // var colorArray = ['#f3c26e', '#008855', '#9e8dec', '#66b3d4', '#fc6583', '#8db700', '#ff987c', '#a8d9dd', '#66c2a5', '#f9ae75', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3']
    var colorArray = ['#69b3a2', '#008855', '#9e8dec', '#0670B4', '#fc6583', '#8db700', '#ff987c', '#a8d9dd', '#f3c26e', '#f9ae75', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3']
    // var colorArray = ['#69b3a2', '#008855', '#9e8dec', '#66b3d4', '#fc6583', '#8db700', '#ff987c', '#a8d9dd', '#f3c26e', '#f9ae75', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3']
    // console.log(averageROIArray);
    // console.log(genreArray);
    // console.log(genreCountArray);

    // var genreX = [svgWidth/7, svgWidth/7*2, svgWidth/7*3, svgWidth/7*4, svgWidth/7*5, svgWidth/7*6];
    // var genreY = [svgHeight/5, svgHeight/5*2, svgHeight/5*3, svgHeight/5*4];


    // ------------------------------------------Director and Actor data processing
    // Director
    var averageDirector = d3.rollup(mData, v => d3.sum(v, d => d.gross)/v.length, d => d.director);
    var averageDirectorArray = Array.from(averageDirector, function(item) {
        return {director: item[0], avgGross: item[1]}
    });
    averageDirectorArray = averageDirectorArray.slice().sort((a, b) => d3.descending(a.avgGross, b.avgGross));
    var directorArray = Array.from(averageDirectorArray, function(item) {
        return item.director
    });
    

    var directorCount = d3.rollup(mData, v => v.length, d => d.director);
    var directorCountArray = Array.from(directorCount, function(item) {
        return {director: item[0], count: item[1]}
    });
    directorCountArray = directorCountArray.slice().sort((a, b) => d3.descending(a.count, b.count));

    var top5GrossDirector = directorArray.slice(0,5);
    var moviesByDirector = d3.group(mData, d => d.director);
    var top5GrossDirectorMovies = [moviesByDirector.get(top5GrossDirector[0]), moviesByDirector.get(top5GrossDirector[1]), moviesByDirector.get(top5GrossDirector[2]), moviesByDirector.get(top5GrossDirector[3]), moviesByDirector.get(top5GrossDirector[4])]

    // Actor
    var averageActor = d3.rollup(mData, v => d3.sum(v, d => d.gross)/v.length, d => d.actor);
    var averageActorArray = Array.from(averageActor, function(item) {
        return {actor: item[0], avgGross: item[1]}
    });
    averageActorArray = averageActorArray.slice().sort((a, b) => d3.descending(a.avgGross, b.avgGross));
    var actorArray = Array.from(averageActorArray, function(item) {
        return item.actor
    });
    

    var actorCount = d3.rollup(mData, v => v.length, d => d.actor);
    var actorCountArray = Array.from(actorCount, function(item) {
        return {actor: item[0], count: item[1]}
    });
    actorCountArray = actorCountArray.slice().sort((a, b) => d3.descending(a.count, b.count));

    var top5GrossActor = actorArray.slice(0,5);
    var moviesByActor = d3.group(mData, d => d.actor);
    var top5GrossActorMovies = [moviesByActor.get(top5GrossActor[0]), moviesByActor.get(top5GrossActor[1]), moviesByActor.get(top5GrossActor[2]), moviesByActor.get(top5GrossActor[3]), moviesByActor.get(top5GrossActor[4])]



    var top5 = [top5GrossDirector, top5GrossActor]
    var top5sMovies = [top5GrossDirectorMovies, top5GrossActorMovies]
    var top5AvgGross = [averageDirectorArray.slice(0,5), averageActorArray.slice(0,5)]
    var yAxisList = ['director', 'actor']
    // console.log(directoryArray);
    // console.log(averageActorArray);
    // console.log(actorArray);
    // console.log(actorCountArray);
    // console.log(top5GrossActor)
    // console.log(top5GrossActorMovies);

    //-----------------Movie data processing
    // var tempMData = mData;
    // var movieGrossHightoLow = mData.sort((a, b) => d3.descending(a.gross, b.gross));
    var movieGrossHightoLow = mData.slice().sort((a, b) => b.gross - a.gross);
    var top5MovieGross = movieGrossHightoLow.slice(0,5);
    // // console.log('movie top5')
    // console.log(top5MovieGross);
    // console.log(mData)







    function handleResize() {
        // 1. update height of step elements
        let stepH = Math.floor(window.innerHeight * 0.75);
        step.style("height", stepH + "px");
    
    
            /* ------------------- initialize your charts and groups here ------------------ */
    
    
        // let svgHeight = window.innerHeight/1.5;
        // let svgMarginTop = (window.innerHeight - svgHeight) / 2;
        // let svgWidth = window.innerWidth - 20*16;
    
        svg
            .attr("height", svgHeight + "px")
            .attr('width', window.innerWidth)
            .style("top", svgMarginTop + "px");
        
        // let nodeGroup = svg.append('g')
        //     .attr('class', 'nodeGroup') 

        // let barGroup = svg.append('g')
        //     .attr('class', 'barGroup')
    
    
        // let scatterPlotGroup = svg.append('g')
        //     .attr('class', 'scatterGroup')

        
        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        // console.log(response);
        // response = { element, direction, index }

        // add color to current step only
        step.classed("is-active", function (d, i) {
            return i === response.index;
        });

        // update graphic based on step

        switch (response.index) {
            case 0:
                createNodes()
                break;
            case 1:
                updateNodes1()
                break;
            // case 2:
            //     updateNodes2()
            //     break;
            case 2:
                updateNodes3()
                break;
            case 3:
                updateNodes4()
                break;
            case 4:
                createDots('imdb')
                break;
            case 5:
                createDots('duration')
                break;
            case 6:
                createBars(0)
                break;
            case 7:
                createBars(1)
                break;            
            default:
                break;
        }       
    }

    function init() {

        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
    
        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
            .setup({
                step: "#scrolly article .step",
                offset: 0.33,
                // debug: true
            })
            .onStepEnter(handleStepEnter);
    }
    
    // kick things off
    init();

    function createNodes() {

        highlight = false;

        d3.select('.nodeGroup')
            .transition()
            .duration(10000)
            // .style('visibility', 'visible')
            .style('opacity', 100)

        d3.select('.spGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        d3.select('.barGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        let simulation = d3.forceSimulation(mData)
            .force('charge', d3.forceManyBody().strength(-6))
            .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
            .force('collision', d3.forceCollide().radius(function (d) {
                // return d.gross/10000000;
                return 4 * Math.sqrt(d.gross/20000000);
            }))
            .force('x', d3.forceX().x(function (d) {
                return ''
            }))
            .force('y', d3.forceY().y(function (d) {
                return ''
            }))
    
            .on('tick', ticked)

        annotation1
            .style('visibility', 'hidden')
        annotation2
            .style('visibility', 'hidden')
        annotation3
            .style('visibility', 'hidden')
    }

    // function updateNodes2() {
    //     d3.select('.nodeGroup')
    //         .transition()
    //         .duration(10000)
    //         // .style('visibility', 'visible')
    //         .style('opacity', 100)

    //     d3.select('.spGroup')
    //         .transition()
    //         .duration(1000)
    //         .style('opacity', 0)
    //         // .style('visibility', 'hidden')

    //     let simulation = d3.forceSimulation(mData)
    //         .force('charge', d3.forceManyBody().strength(-6))
    //         // .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
    //         .force('collision', d3.forceCollide().radius(function (d) {
    //             // return d.gross/10000000;
    //             return 4 * Math.sqrt(d.gross/20000000);
    //         }))
    //         // .force('x', d3.forceX().x(function (d) {
    //         //     return ''
    //         // }))
    //         // .force('y', d3.forceY().y(function (d) {
    //         //     return ''
    //         // }))
    //         .force('x', d3.forceX().x(function (d) {
    //             if (d.genre == 'Adventure') {
    //                 return svgWidth/3;
    //             } else if (d.genre == 'Action') {
    //                 return svgWidth/3*2;
    //             } else {
    //                 return svgWidth/2
    //             }
    //         }))
    //         .force('y', d3.forceY().y(function (d) {
    //             if (d.genre == 'Adventure' || d.genre == 'Action') {
    //                 return svgHeight/5.4*3;
    //             } else {
    //                 return svgHeight/2.5
    //             }
    //         }))
    //         .on('tick', ticked)

    //     highlight = true;

            
    // }

    function updateNodes1() {

        highlight = false;

        d3.select('.nodeGroup')
            .transition()
            .duration(10000)
            // .style('visibility', 'visible')
            .style('opacity', 100)

        d3.select('.spGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        d3.select('.barGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        let simulation = d3.forceSimulation(mData)
            .force('charge', d3.forceManyBody().strength(-6))
            // .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
            .force('collision', d3.forceCollide().radius(function (d) {
                // return d.gross/10000000;
                return 4 * Math.sqrt(d.gross/20000000);
            }))
            .force('x', d3.forceX().x(function (d) {
                if (d.genre == 'Adventure') {
                    return svgWidth/3*1;
                } else if (d.genre == 'Action') {
                    return svgWidth/3*2;
                } else {
                    return svgWidth/2
                }
            }))
            .force('y', d3.forceY().y(function (d) {
                if (d.genre == 'Adventure' || d.genre == 'Action') {
                    return svgHeight/5.4*3;
                } else {
                    return svgHeight/2.5
                }
            }))
            .on('tick', ticked)    

        annotation1
            .style('visibility', 'visible')
            .transition()
            .attr('x', svgWidth/5)
            .attr('y', svgHeight/5.4*4.9)
            .text('Adventure')

        annotation2
            .style('visibility', 'visible')
            .transition()
            .attr('x', svgWidth/3*2)
            .attr('y', svgHeight/5.4*4.9)
            .text('Action')

        annotation3
            .style('visibility', 'hidden')
    }
    

    function updateNodes3() {

        highlight = false;

        d3.select('.nodeGroup')
        .transition()
        .duration(10000)
        // .style('visibility', 'visible')
        .style('opacity', 100)

    d3.select('.spGroup')
        .transition()
        .duration(1000)
        .style('opacity', 0)
        // .style('visibility', 'hidden')

    d3.select('.barGroup')
        .transition()
        .duration(1000)
        .style('opacity', 0)
        // .style('visibility', 'hidden')

        let simulation = d3.forceSimulation(mData)
            .force('charge', d3.forceManyBody().strength(-6))
            // .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
            .force('collision', d3.forceCollide().radius(function (d) {
                // return d.gross/10000000;
                return 4 * Math.sqrt(d.gross/20000000);
            }))
            .force('x', d3.forceX().x(function (d) {
                if (d.genre == 'Comedy') {
                    return svgWidth/3;
                } else if (d.genre == 'Drama') {
                    return svgWidth/3*2;
                } else {
                    return svgWidth/2
                }
            }))
            .force('y', d3.forceY().y(function (d) {
                if (d.genre == 'Comedy' || d.genre == 'Drama') {
                    return svgHeight/5.4*3;
                } else {
                    return svgHeight/2.5
                }
            }))    
            .on('tick', ticked)  
            
            
        annotation1
            // .style('visibility', 'visible')
            .transition()
            // .attr('x', svgWidth/5)
            // .attr('y', svgHeight/5.4*4.9)
            .text('Comedy')

        annotation2
            // .style('visibility', 'visible')
            .transition()
            // .attr('x', svgWidth/3*2)
            // .attr('y', svgHeight/5.4*4.9)
            .text('Drama')
        annotation3
            .style('visibility', 'hidden')
    }

    function updateNodes4() {

        highlight = false;

        d3.select('.nodeGroup')
            .transition()
            .duration(10000)
            // .style('visibility', 'visible')
            .style('opacity', 100)

        d3.select('.spGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        d3.select('.barGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        let simulation = d3.forceSimulation(mData)
            .force('charge', d3.forceManyBody().strength(-6))
            // .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
            .force('collision', d3.forceCollide().radius(function (d) {
                // return d.gross/10000000;
                return 4 * Math.sqrt(d.gross/20000000);
            }))
            .force('x', d3.forceX().x(function (d) {
                if (d.genre == 'Comedy') {
                    return svgWidth/3;
                } else if (d.genre == 'Drama') {
                    return svgWidth/3*2;
                } else {
                    return svgWidth/2
                }
            }))
            .force('y', d3.forceY().y(function (d) {
                if (d.genre == 'Comedy' || d.genre == 'Drama') {
                    return svgHeight/5.2*3;
                } else if (d.genre == 'Horror') {
                    return svgHeight/3;
                } else {
                    return svgHeight/2
                }
            }))    
            .on('tick', ticked)   
            
        annotation3
            .style('visibility', 'visible')
            .transition()
            .attr('x', svgWidth/2.5)
            .attr('y', svgHeight/15)
            .text('Horror')
    }

    let nodeBox = nodeGroup.append('rect')
            .attr('class', 'nodeBox')
            .style('fill', '#ffffff')
            .style('visibility', 'hidden')

    let nodeTooltip = nodeGroup.append('text')
            .attr('class', 'nodeText')
            .style('text-anchor', 'middle')
            .style('visibility', 'hidden');

    let nodeTooltip2 = nodeGroup.append('text')
    .attr('class', 'nodeText')
    .style('text-anchor', 'middle')
    .style('visibility', 'hidden');

    let nodeTooltip3 = nodeGroup.append('text')
        .attr('class', 'nodeText')
        .style('text-anchor', 'middle')
        .style('visibility', 'hidden');

    function ticked() {
        let nodes = d3.select('.nodeGroup')
            .selectAll('circle')
            .data(mData)
            .join('circle')
            .attr('class', 'nodes')
            // .style('fill', '#007acc')
            .style('fill', d => colorArray[genreArray.indexOf(d.genre)])
            // .style('stroke', '#a6b1e1')
            // .attr('r', 10)
            // .attr('r', d => d.gross/10000000)
            .attr('r', d => 4 * Math.sqrt(d.gross/20000000))
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)            
            .on('mouseover', mouseOverNode)
            .on('mouseout', mouseOutNode);


        // if (highlight) {
        //     u.style('opacity', d => ["Jurassic World", "The Avengers", "Avengers: Age of Ultron", "The Dark Knight Rises", "The Hunger Games: Catching Fire"].includes(d.title)? 1: 0.1)
        //     // highlight = false;
        // } else {
        //     u.style('opacity', 1)
        // }
    
        // console.log(u)
    
        
    
        function mouseOverNode(event, d) {
            nodes.transition()
                .style('opacity', dDot => dDot.title == d.title? 1: 0.1);
                console.log('hover');
            nodeTooltip
                .style('visibility', 'visible')
                .transition()
                .attr('x', d.x)
                .attr('y', d.y - 5*16)
                .text(`Title: ${d.title}`);

            nodeTooltip2
                .style('visibility', 'visible')
                .transition()
                .attr('x', d.x)
                .attr('y', d.y -4*16)
                .text('Gross: ' + d.gross);

            // console.log('gross: ' + d.gross)

            nodeTooltip3
                .style('visibility', 'visible')
                .transition()
                .attr('x', d.x)
                .attr('y', d.y - 3*16)
                .text('ROI: ' + d.roi);


            nodeBox
                .style('visibility', 'visible')
                .style('fill', '#ffffff')
                .style('stroke', '#1b1b1b')
                .transition()
                .attr('width', 20*16)
                .attr('height', 4.5*16)
                .attr('x', d.x - 10*16)
                .attr('y', d.y - 6.5*16)
                .attr('rx', 2)

        }
    
        function mouseOutNode(event, d) {
            nodes.transition()
                .style('opacity', 1);
            console.log('out');
            nodeTooltip
                .style('visibility', 'hidden')
            nodeTooltip2
                .style('visibility', 'hidden')
            nodeTooltip3
                .style('visibility', 'hidden')
            nodeBox
                .style('visibility', 'hidden')

            
            
        }

        nodeBox.raise();
        nodeTooltip.raise();
        nodeTooltip2.raise();
        nodeTooltip3.raise();
        

    }


    //--------------------Start creating scatterplot

    var xMax = d3.max(mData.map(d=>+d['imdb']))
    var xMin = d3.min(mData.map(d=>+d['imdb']));
    // console.log(xMin);

    var xSp = d3.scaleLinear()
        .domain([0,xMax])
        .range([0, spWidth]);

    var yMax = d3.max(mData.map(d=>+d.gross))
    var yMin = d3.min(mData.map(d=>+d.gross));

    var ySp = d3.scaleLinear()
        .domain([-15000000, yMax])
        .range([maxSpHeight,0]);  

    // let dots = dotsArea
    //     // .attr('class', 'spGroup')
    //     .selectAll(".circles")
    //     .data(mData)
    //     .enter()
    //     .append("circle")
    //     // .join('circle')
    //     .attr('class', 'dots')

    //Adding axes
    // //add x axis 

    xAxisSp = spGroup.append("g")
        .attr("transform", `translate(0, ${maxSpHeight})`)
        .call(d3.axisBottom(xSp))

    spGroup.append('text')
        .attr('class', 'label xSp')
        .attr('transform', `translate(${spWidth/2}, ${maxSpHeight + 45})`)
        .style('text-anchor', 'middle')
        .text(`Movie IMDb`);

    let dotsArea = spGroup.append('g');

    // add y axis

    yAxisSp = spGroup.append("g")
        .call(d3.axisLeft(ySp));

    spGroup.append('text')
    .attr('class', 'label ySp')
    .attr('transform', `translate(-90,${maxSpHeight/2}) rotate(270)`)
    .style('text-anchor', 'middle')
    .text('Gross');


    let dotBox = spGroup.append('rect')
            .attr('class', 'dotBox')
            .style('fill', '#ffffff')
            .style('visibility', 'hidden')

    let dotTooltip = spGroup.append('text')
            .attr('class', 'dotText')
            .style('text-anchor', 'middle')
            .style('visibility', 'hidden');

    let dotTooltip2 = spGroup.append('text')
    .attr('class', 'dotText')
    .style('text-anchor', 'middle')
    .style('visibility', 'hidden');

    let dotTooltip3 = spGroup.append('text')
        .attr('class', 'dotText')
        .style('text-anchor', 'middle')
        .style('visibility', 'hidden');



    function createDots(xAxis_input) {

        d3.select('.nodeGroup')
            .transition()
            .duration(500)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        d3.select('.spGroup')
            .transition()
            .duration(5000)
            // .style('visibility', 'visible')
            .style('opacity', 100)
        
        d3.select('.barGroup')
            .transition()
            .duration(500)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        annotation1
            .style('visibility', 'hidden')
        annotation2
            .style('visibility', 'hidden')
        annotation3
            .style('visibility', 'hidden')
        

        xMax = d3.max(mData.map(d=>+d[xAxis_input]))
        xMin = d3.min(mData.map(d=>+d[xAxis_input]));
        // console.log(xMin);

        xSp.domain([0,xMax])
            .range([0, spWidth]);

        // var yMax = d3.max(mData.map(d=>+d.gross))
        // var yMin = d3.min(mData.map(d=>+d.gross));

        // const ySp = d3.scaleLinear()
        //     .domain([-15000000, yMax])
        //     .range([maxSpHeight,0]);  
            
        
        // let dots = spGroup.append('g')
        // let dots = dotsArea
        var dots = dotsArea
            // .attr('class', 'spGroup')
            .selectAll('circle')
            .data(mData)
            // .enter()
            // .append("circle")
            .join('circle')
            .attr('class', 'dots')
            .on('mouseover', mouseOverDot)
            .on('mouseout', mouseOutDot);


            dots
            .transition()
            .duration(500)
            // .attr("cx", d => xSp(d[xAxis_input]))
            .attr("cx", function(d) {
                // console.log(xSp(d[xAxis_input]))
                return xSp(d[xAxis_input])
            })
            .attr("cy", d => ySp(d.gross))
            // .attr("r", d => sizeCircle(d.Windspeed));
            .style('fill', '#3fb37b')
            .style('opacity', 0.4)
            .attr("r",5);

            // console.log(xSp(7.5))
            // console.log(xSp(mData[0][xAxis_input]))
            // console.log(mData[0][xAxis_input])

        //Adding axes
        // //add x axis 

        xAxisSp.transition()
            .call(d3.axisBottom(xSp))

        d3.select('.label.xSp')
            .text(`Movie ${xAxis_input.charAt(0).toUpperCase() + xAxis_input.slice(1)}`);


        function mouseOverDot(event, d) {
            console.log('hover');
            dotTooltip
                .style('visibility', 'visible')
                .transition()
                .attr('x', xSp(d[xAxis_input]))
                .attr('y', ySp(d.gross) - 5*16)
                .text(`Title: ${d.title}`);

            dotTooltip2
                .style('visibility', 'visible')
                .transition()
                .attr('x', xSp(d[xAxis_input]))
                .attr('y', ySp(d.gross) -4*16)
                .text('Gross: ' + d[xAxis_input]);

            // console.log('gross: ' + d.gross)

            dotTooltip3
                .style('visibility', 'visible')
                .transition()
                .attr('x', xSp(d[xAxis_input]))
                .attr('y', ySp(d.gross) - 3*16)
                .text('ROI: ' + d.gross);


            dotBox
                .style('visibility', 'visible')
                .style('fill', '#ffffff')
                .style('stroke', '#1b1b1b')
                .transition()
                .attr('width', 20*16)
                .attr('height', 4.5*16)
                .attr('x', xSp(d[xAxis_input])- 10*16)
                .attr('y', ySp(d.gross) - 6.5*16)
                .attr('rx', 2)

            dots.transition()
                .style('opacity', dDot => dDot.title == d.title? 0.7: 0.1);
        }
    
        function mouseOutDot(event, d) {
            console.log('out');
            dotTooltip
                .style('visibility', 'hidden')
            dotTooltip2
                .style('visibility', 'hidden')
            dotTooltip3
                .style('visibility', 'hidden')
            dotBox
                .style('visibility', 'hidden')
            
            dots.transition()
                .style('opacity', 0.4);
            
        }

        dotBox.raise();
        dotTooltip.raise();
        dotTooltip2.raise();
        dotTooltip3.raise();

    }

    
    //--------------------Start creating barchart
    

    var xMaxBar = d3.max(averageDirectorArray.map(d=>+d['avgGross']))
    // console.log(xMin);

    var xBar = d3.scaleLinear()
        .domain([0, xMaxBar])
        .range([0, spWidth]);

    var yBar = d3.scaleBand()
        .domain(top5GrossDirector)
        .range([0, maxSpHeight])
        .padding(0.4); 

    let barsArea = barGroup.append('g');
    

    //Adding axes
    // //add x axis 

    var xAxisBar = barGroup.append("g")
        .attr("transform", `translate(0, ${maxSpHeight})`)
        .call(d3.axisBottom(xBar))

    barGroup.append('text')
        .attr('class', 'label xBar')
        .attr('transform', `translate(${spWidth/2}, ${maxSpHeight + 45})`)
        .style('text-anchor', 'middle')
        .text(`Gross`);


    // add y axis

    yAxisBar = barGroup.append("g")
        .call(d3.axisLeft(yBar));

    barGroup.append('text')
    .attr('class', 'label yBar')
    .attr('transform', `translate(-120,${maxSpHeight/2}) rotate(270)`)
    .style('text-anchor', 'middle')
    .text('Director');


    function createBars(yAxis_input) {

        d3.select('.nodeGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        d3.select('.spGroup')
            .transition()
            .duration(1000)
            // .style('visibility', 'visible')
            .style('opacity', 0)
        
        d3.select('.barGroup')
            .transition()
            .duration(10000)
            // .style('visibility', 'visible')
            .style('opacity', 100)
        

        xMaxBar = d3.max(top5AvgGross[yAxis_input].map(d=>+d.avgGross))
        // console.log(xMin);

        xBar.domain([0,700000000])
            .range([0, spWidth]);


        yBar.domain(top5[yAxis_input])
            .range([0, maxSpHeight]);  
            
        
        // let dots = spGroup.append('g')
        // let dots = dotsArea
        var bars = barsArea
            // .attr('class', 'spGroup')
            .selectAll('rect')
            .data(top5AvgGross[yAxis_input])
            // .enter()
            // .append("circle")
            .join('rect')
            .attr('class', 'bars')
            .on('mouseover', mouseOverBar)
            .on('mouseout', mouseOutBar);

        bars.transition()
            // .attr("cx", d => xSp(d[xAxis_input]))
            .attr("x", 0)
            .attr("y", d => yBar(d[yAxisList[yAxis_input]]))
            .attr("width", d => xBar(d.avgGross))
            .attr("height", yBar.bandwidth())
            .style('fill', '#3fb37b')
        
        
            

            // console.log(xSp(7.5))
            // console.log(xSp(mData[0][xAxis_input]))
            // console.log(mData[0][xAxis_input])

        //Adding axes
        // //add x axis 

        xAxisBar.transition()
            .call(d3.axisBottom(xBar).ticks(5))

        yAxisBar.transition()
            .call(d3.axisLeft(yBar))

        d3.select('.label.yBar')
            .text(`${yAxisList[yAxis_input].charAt(0).toUpperCase() + yAxisList[yAxis_input].slice(1)}`);


        // Add hover tooltip
        // bars.style('cursor', 'pointer')            
        //     .on('mouseover', mouseOverBar)
        //     .on('mouseout', mouseOutBar);
            
        
        let barBox = barsArea.append('rect')
            .attr('class', 'barBox')
            .style('fill', '#ffffff')
            // .attr('x', d => xSp(d.TempMax))
            // .attr('y', d => ySp(d.Dewpoint)-0.7*16)
            // .text(d => `TempMax: ${d.TempMax}`)
            .style('visibility', 'hidden')
            // .lower()

        let barTooltip = barsArea.append('text')
            .attr('class', 'barText')
            // .style('text-anchor', 'middle')
            // .attr('x', d => xSp(d.TempMax))
            // .attr('y', d => ySp(d.Dewpoint)-0.7*16)
            // .text(d => `TempMax: ${d.TempMax}`)
            .style('visibility', 'hidden')
            // .lower()
        let barTooltip2 = barsArea.append('text')
            .attr('class', 'barText')
            // .style('text-anchor', 'middle')
            // .attr('x', d => xSp(d.TempMax))
            // .attr('y', d => ySp(d.Dewpoint)-0.7*16)
            // .text(d => `TempMax: ${d.TempMax}`)
            .style('visibility', 'hidden')
            // .lower()

        let yLine = barsArea.append("line")
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style("visibility", "hidden")
            // .lower()


        let barTooltips = barsArea.selectAll('.movieLines')
            // .data()

        // for (i in [...Array(top5GrossDirectorMovies[yAxis_input].length).keys()]) {
        //     let barTooltipX = barsArea.append('text')
        //         .attr('class', 'barText')
        //         // .style('text-anchor', 'middle')
        //         // .attr('x', d => xSp(d.TempMax))
        //         // .attr('y', d => ySp(d.Dewpoint)-0.7*16)
        //         // .text(d => `TempMax: ${d.TempMax}`)
        //         .style('visibility', 'hidden')
        //         .lower()
        //     barTooltips.push(barTooltipX);
        // }
        

        

        function mouseOverBar(event, d) {
            console.log('hover bar')
            var dOrA = yAxisList[yAxis_input] //director or actor

            var movieLinesData = top5sMovies[yAxis_input][top5[yAxis_input].indexOf(d[dOrA])];
            // console.log(movieLinesData);

            barsArea.selectAll('.movieLines')
            // barTooltips
                .data(movieLinesData)
                .join('text')
                .attr('class', 'movieLines barText')
                .style('visibility', 'visible')
                .transition()
                .attr('x', xBar(d.avgGross) - 17.5*16)
                .attr('y', movie => yBar(d[dOrA]) + (-3 + movieLinesData.indexOf(movie))*16)
                // .text(`● hello`);
                .text(movie =>`● ${movie.title} (Gross: ${movie.gross})`);
            
            barTooltip
                .style('visibility', 'visible')
                .transition()
                .attr('x', xBar(d.avgGross) - 17.5*16)
                .attr('y', yBar(d[dOrA]) -5*16)
                .text(dOrA.charAt(0).toUpperCase() + dOrA.slice(1) + ': ' + d[dOrA]);

            barTooltip2
                .style('visibility', 'visible')
                .transition()
                .attr('x', xBar(d.avgGross) - 17.5*16)
                .attr('y', yBar(d[dOrA]) - 4*16)
                .text('Average gross: ' + d.avgGross);

            yLine
                .style('visibility', 'visible')
                .transition()
                .attr('x1', xBar(d.avgGross) - 5.5*16)
                .attr('x2', xBar(d.avgGross) - 5.5*16)
                .attr('y1', yBar(d[dOrA]))
                .attr('y2', yBar(d[dOrA]) - 6.5*16)

            barBox
                .style('visibility', 'visible')
                .style('fill', '#ffffff')
                .style('stroke', '#1b1b1b')
                .transition()
                .attr('width', 26*16)
                .attr('height', (2+movieLinesData.length)*16 + 20)
                .attr('x', xBar(d.avgGross) - 18.5*16)
                .attr('y', yBar(d[dOrA]) - 6.5*16)
                .attr('rx', 2)

            bars.transition()
                .style('opacity', dDot => dDot[dOrA] == d[dOrA]? 1: 0.1);
                
            

            // console.log(d[dOrA]);

            
            
            
            // Highlight
            // dots
            //     .transition()
            //     .style('opacity', dDot => dDot.TempMax === d.TempMax && dDot.Dewpoint === d.Dewpoint ? 0.7 : 0.1);
            
                
                
        }

        function mouseOutBar(event, d) {
            // circleTooltip.style('visibility', 'hidden');
            // circleTooltip2.style('visibility', 'hidden');
            d3.selectAll('.movieLines').style('visibility', 'hidden');
            barBox.style('visibility', 'hidden');
            barTooltip.style('visibility', 'hidden');
            barTooltip2.style('visibility', 'hidden');
            // xLine.style('visibility', 'hidden');
            yLine.style('visibility', 'hidden');



            // // De-highlight
            bars
                .transition()
                .style('opacity', 1);
        }

        yLine.raise();
        barBox.raise();
        barTooltip.raise();
        barTooltip2.raise();
        barsArea.selectAll('.movieLines').raise();
        xAxisBar.lower();
        yAxisBar.lower();


    }

    

})

