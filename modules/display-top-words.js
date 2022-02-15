export function test() {
  d3.select(".best-word-box").attr("height", "20px").text("tet");
}

export function show(topWords) {
  d3.select(".best-word-box").selectAll("p").remove();

  d3.select(".best-word-box")
    .selectAll("p")
    .data(topWords)
    .enter()
    .append("p")
    .text((d) => `${d.word}: ${d.score}`)
    .classed("best-word", true);
}
