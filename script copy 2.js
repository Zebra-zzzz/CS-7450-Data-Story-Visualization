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


let spGroup = svg.append('g')
    .attr('class', 'spGroup')
    .attr('transform', 'translate(' + (svgWidth - spWidth)/2 + ',' + (svgHeight - maxSpHeight)/2 + ')')


// initialize the scrollama
let scroller = scrollama();

d3.csv("./movies.csv",
// Preprocessing dataset, for movies with more than one genres, randomly pick one genre
    function(d) {
        var genresArray = [...d.genres.matchAll(myRe)];
        return {title: d.movie_title, genre: genresArray[0]['0'], gross: d.gross, content_rating: d.content_rating, country: d.country, director: d.director_name, duration: d.duration, imdb: d.imdb_score, likes: d.movie_facebook_likes, year: d.title_year}
        // return {title: d.movie_title, genre: genresArray[Math.floor(Math.random() * genresArray.length)]['0'], gross: d.gross, content_rating: d.content_rating, country: d.country, director: d.director_name, duration: d.duration, imdb: d.imdb_score, likes: d.movie_facebook_likes, year: d.title_year}
        // return {genre: [...d.genres.matchAll(myRe)][0]['0']}
    }).then(function (data) {
    // ).then(function (data) {
    // Remove the datapoints missing essential properties
    mData = data.filter(function(d) {
        // return d['genre']
        return d['content_rating'] && d['country'] && d['director'] && d['duration'] && d['genre'] && d['gross'] && d['imdb'] && d['likes'] && d['title'] && d['year']
        // return !d['content_rating'] || !d['country'] || !d['director_name'] || !d['duration'] || !d['genres'] || !d['gross'] || !d['imdb_score'] || !d['movie_facebook_likes'] || !d['movie_title'] || !d['title_year']
    })
    
    // console.log(mData);
    // console.log(data);

    // -------------------------------------------- Genre data processing
    var average = d3.rollup(mData, v => d3.sum(v, d => d.gross)/v.length, d => d.genre);
    var averageArray = Array.from(average, function(item) {
        return {genre: item[0], avgGross: item[1]}
    });
    averageArray = averageArray.slice().sort((a, b) => d3.descending(a.avgGross, b.avgGross));
    

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
    console.log(averageArray);
    console.log(genreArray);
    console.log(genreCountArray);

    // var genreX = [svgWidth/7, svgWidth/7*2, svgWidth/7*3, svgWidth/7*4, svgWidth/7*5, svgWidth/7*6];
    // var genreY = [svgHeight/5, svgHeight/5*2, svgHeight/5*3, svgHeight/5*4];


    // ------------------------------------------Country data processing
    var averageCountry = d3.rollup(mData, v => d3.sum(v, d => d.gross)/v.length, d => d.country);
    var averageCountryArray = Array.from(averageCountry, function(item) {
        return {country: item[0], avgGross: item[1]}
    });
    averageCountryArray = averageCountryArray.slice().sort((a, b) => d3.descending(a.avgGross, b.avgGross));
    

    var countryCount = d3.rollup(mData, v => v.length, d => d.country);
    var countryCountArray = Array.from(countryCount, function(item) {
        return {country: item[0], count: item[1]}
    });
    countryCountArray = countryCountArray.slice().sort((a, b) => d3.descending(a.count, b.count));

    var countryArray = Array.from(countryCountArray, function(item) {
        return item.country
    });

    // console.log(averageCountryArray);
    // console.log(countryArray);
    // console.log(countryCountArray);







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
        console.log(response);
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
            case 2:
                updateNodes2()
                break;
            case 3:
                createDots('imdb')
                break;
            case 4:
                createDots('duration')
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

    
    }

    function updateNodes1() {

        // d3.select('.nodeGroup')
        //     .transition()
        //     .duration(1000)
        //     // .style('visibility', 'visible')
        //     .style('opacity', 100)

        // d3.select('.spGroup')
        //     .transition()
        //     .duration(1000)
        //     .style('opacity', 0)
        //     // .style('visibility', 'hidden')

        let simulation = d3.forceSimulation(mData)
            .force('charge', d3.forceManyBody().strength(-6))
            // .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
            .force('collision', d3.forceCollide().radius(function (d) {
                // return d.gross/10000000;
                return 4 * Math.sqrt(d.gross/20000000);
            }))
            .force('x', d3.forceX().x(function (d) {
                if (d.genre == 'Adventure') {
                    return svgWidth/3;
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
            // .force('x', d3.forceX().x(function (d) {
            //     return genreX[(genreArray.indexOf(d.genre)) % 6]
            // }))
            // .force('y', d3.forceY().y(function (d) {
            //     return genreY[Math.floor((genreArray.indexOf(d.genre)) / 6)]
            // }))
            // .force('x', d3.forceX().x(function (d) {
            //     return ''
            // }))
            // .force('y', d3.forceY().y(function (d) {
            //     return ''
            // }))
    
            .on('tick', ticked)    
    }

    function updateNodes2() {

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
    }

    let nodeTooltip = nodeGroup.append('text')
            .attr('class', 'text')
            .style('visibility', 'hidden');

    function ticked() {
        let u = d3.select('.nodeGroup')
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
    
        // console.log(u)
    
        
    
        function mouseOverNode(event, d) {
            console.log('hover');
            nodeTooltip
                .style('visibility', 'visible')
                .transition()
                .attr('x', d.x)
                .attr('y', d.y)
                .text(`${d.title}`);
        }
    
        function mouseOutNode(event, d) {
            console.log('out');
            nodeTooltip
                .style('visibility', 'hidden')
        }

        nodeTooltip.raise();

    }


    //--------------------Start creating scatterplot

    var xMax = d3.max(mData.map(d=>+d['imdb']))
    var xMin = d3.min(mData.map(d=>+d['imdb']));
    // console.log(xMin);

    const xSp = d3.scaleLinear()
        .domain([xMin-1,xMax])
        .range([0, spWidth]);

    var yMax = d3.max(mData.map(d=>+d.gross))
    var yMin = d3.min(mData.map(d=>+d.gross));

    const ySp = d3.scaleLinear()
        .domain([-15000000, yMax])
        .range([maxSpHeight,0]);  

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

    // add y axis

    yAxisSp = spGroup.append("g")
        .call(d3.axisLeft(ySp));

    spGroup.append('text')
    .attr('class', 'label ySp')
    .attr('transform', `translate(-90,${maxSpHeight/2}) rotate(270)`)
    .style('text-anchor', 'middle')
    .text('Gross');



    function createDots(xAxis_input) {

        d3.select('.nodeGroup')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            // .style('visibility', 'hidden')

        d3.select('.spGroup')
            .transition()
            .duration(10000)
            // .style('visibility', 'visible')
            .style('opacity', 100)
        

        xMax = d3.max(mData.map(d=>+d[xAxis_input]))
        xMin = d3.min(mData.map(d=>+d[xAxis_input]));
        // console.log(xMin);

        xSp.domain([xMin-1,xMax])
            .range([0, spWidth]);

        // var yMax = d3.max(mData.map(d=>+d.gross))
        // var yMin = d3.min(mData.map(d=>+d.gross));

        // const ySp = d3.scaleLinear()
        //     .domain([-15000000, yMax])
        //     .range([maxSpHeight,0]);  
            
        let dotsArea = spGroup.append('g');
        // let dots = spGroup.append('g')
        // let dots = dotsArea
        let dots = dotsArea
            // .attr('class', 'spGroup')
            .selectAll(".circles")
            .data(mData)
            .enter()
            .append("circle")
            // .join('circle')
            .attr('class', 'dots')
            .transition()
            .attr("cx", d => xSp(d[xAxis_input]))
            .attr("cy", d => ySp(d.gross))
            // .attr("r", d => sizeCircle(d.Windspeed));
            .style('fill', '#007acc')
            .attr("r",5);

        //Adding axes
        // //add x axis 

        xAxisSp.transition()
            .call(d3.axisBottom(xSp))

        d3.select('.label.ySp')
            .text(`Movie ${xAxis_input.charAt(0).toUpperCase() + xAxis_input.slice(1)}`);

        // add y axis

        spGroup.append("g")
        .call(d3.axisLeft(ySp));

        // spGroup.append('text')
        // .attr('class', 'label')
        // .attr('transform', `translate(-90,${maxSpHeight/2}) rotate(270)`)
        // .style('text-anchor', 'middle')
        // .text('Gross');

    }

    
    

    

})

