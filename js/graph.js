var ConvertDataAndStart = function(resData){
    $(".wordcloud").remove(); // wordcloud 삭제요청 없으면 무시됨.
    $(".text").remove();
    $(".confidence").remove();
    var caption_text = resData.description.captions[0].text;
    var caption_confidence = resData.description.captions[0].confidence;
    var tags_list = resData.description.tags;

    var frequency_list = [];
    var part = tags_list.length * 0.01;
    var size_3_limit = part * 30;
    var size_2_limit = size_3_limit + part * 30;
    var size_1_limit = size_2_limit + part * 40;

    for(var i=0; i<tags_list.length; i++){
        //
        var rn = Math.floor(Math.random() * 2);
        var temp = {
            "text" : tags_list[tags_list.length-i-1],
            "size" : (i<size_3_limit) ? 15 : (i<size_2_limit) ? 25 : (i <size_1_limit) ? 40 : 40,
            "rotate" : rn === 1 ? 90 : 0
        };
        frequency_list.push(temp);
    }
    graph_start(frequency_list,caption_text, caption_confidence);
};
var graph_start = function (frequency_list, text, confidence){

    /* 기존 D3에 데이터를 대입 했을 때, 이런 형식으로 집어 넣었을 것이다.
    var frequency_list = [
        {"text":"study","size":40},
        {"text":"motion","size":15},
    ];
    이 자료에서도 똑같은 형식으로 데이터를 집어 넣는다. 다만 외부에서 JSON 객체를 받아서 그래프에 맞게 변환 시킬 뿐이다.
    */

    var color = d3.scale.linear()
        .domain([0,1,2,3,4,5,6,10,15,20,100])
        .range(["#60A917", "#008A00", "#00ABA9", "#0050EF", "#AA00FF", "#D80073", "#A20025", "#FA6800", "#F0A30A", "#E3C800", "#E51400", "#825A2C"]);

    d3.layout.cloud().size([800, 300])
        .words(frequency_list)
        .rotate(function(d) { return d.rotate; })
        .font('Impact')
        .padding(5)
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select("body").append("svg")
            .attr("width", 850)
            .attr("height", 350)
            .attr("class", "wordcloud")
            .append("g")
            .attr("transform", "translate(300,100)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
        d3.select("body").append("div").attr("class","text").append('span')
            .text("인식 문장 : "+text);
        d3.select("body").append("div").attr("class","confidence").append("span")
            .text("문장 유사도 : " + confidence);
    }

};