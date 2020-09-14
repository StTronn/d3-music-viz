$("body").on("click", function () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById("audioElement");
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(200);

  var svgHeight = "399";
  var svgWidth = "1200";
  var barPadding = "4";

  function createSvg(parent, height, width) {
    return d3
      .select(parent)
      .append("svg")
      .attr("height", height)
      .attr("width", width);
  }

  var svg = createSvg("body", svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg
    .selectAll("rect")
    .data(frequencyData)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
      return i * (svgWidth / frequencyData.length);
    })
    .attr("r", svgWidth / frequencyData.length - barPadding);

  // Continuously loop and update chart with frequency data.
  function renderChart() {
    requestAnimationFrame(renderChart);

    // Copy frequency data to frequencyData array.
    analyser.getByteFrequencyData(frequencyData);

    // Update d3 chart with new data.
    svg
      .selectAll("circle")
      .data(frequencyData)
      .attr("cy", function (d) {
        return svgHeight - d;
      })
      .attr("fill", function (d) {
        return "hsl(" + d * 1.4 + ", 80%, 60%)";
      });
  }

  // Run the loop
  renderChart();
});
