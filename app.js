// Job application funnel data
const data = [
  { stage: "Applied", count: 767 },
  { stage: "Behavioral Screening", count: 80 },
  { stage: "Assignment / 1st Round", count: 45 },
  { stage: "2nd Round", count: 13 },
  { stage: "3rd Round", count: 8 },
  { stage: "4th Round", count: 5 },
  { stage: "Final Round", count: 3 },
  { stage: "Offer", count: 2 },
];

// Select DOM elements
const svg = d3.select("svg");
const narration = d3.select("#narration");

// Chart dimensions and layout
const width = +svg.attr("width");
const barHeight = 40;
const barGap = 30;

// Create scale for bar widths
const x = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.count)])
  .range([0, width - 250]);

// Create groups for each stage
const groups = svg
  .selectAll("g.stage")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "stage")
  .attr(
    "transform",
    (d, i) => `translate(200, ${i * (barHeight + barGap) + 30})`
  );

// Create bars
groups
  .append("rect")
  .attr("class", (d) => (d.stage === "Offer" ? "bar highlight" : "bar"))
  .attr("height", barHeight)
  .attr("width", 0);

// Add stage labels
groups
  .append("text")
  .attr("class", "label")
  .attr("x", -10)
  .attr("y", barHeight / 2)
  .attr("text-anchor", "end")
  .text((d) => d.stage);

// Add count labels
groups
  .append("text")
  .attr("class", "count")
  .attr("x", 10)
  .attr("y", barHeight / 2)
  .attr("opacity", 0)
  .text((d) => d.count);

// Add drop-off percentage labels
groups
  .append("text")
  .attr("class", "dropoff")
  .attr("x", (d) => x(d.count) + 20)
  .attr("y", barHeight / 2)
  .attr("opacity", 0)
  .text((d, i) => {
    if (i === 0) return "";
    const prev = data[i - 1].count;
    const drop = ((1 - d.count / prev) * 100).toFixed(1);
    return `-${drop}%`;
  });

// Create narration messages
const messages = data.map((d, i) => {
  if (i === 0) return `I applied to ${d.count} jobs across various companies and roles.`;
  if (i === data.length - 1)
    return `Success! I received ${d.count} job offers after this intensive process. 🎉`;
  const prev = data[i - 1].count;
  const drop = ((1 - d.count / prev) * 100).toFixed(1);
  return `${d.count} candidates advanced to ${d.stage} (${drop}% were filtered out).`;
});

// Animate the visualization with coordinated timing
data.forEach((d, i) => {
  // Animate bar width
  groups
    .filter((g, j) => i === j)
    .select("rect")
    .transition()
    .delay(i * 1800)
    .duration(1000)
    .ease(d3.easeBackOut)
    .attr("width", (d) => x(d.count));

  // Animate count label appearance
  groups
    .filter((g, j) => i === j)
    .select(".count")
    .transition()
    .delay(i * 1800 + 600)
    .duration(500)
    .attr("opacity", 1);

  // Animate drop-off percentage (except first stage)
  groups
    .filter((g, j) => i === j)
    .select(".dropoff")
    .transition()
    .delay(i * 1800 + 800)
    .duration(500)
    .attr("opacity", (d) => (d.stage === "Applied" ? 0 : 1));

  // Update narration text with fade effect
  setTimeout(() => {
    narration.style.opacity = 0;
    setTimeout(() => {
      narration.text(messages[i]);
      narration.style.opacity = 1;
    }, 200);
  }, i * 1800 + 400);
});

// Add hover interactivity
groups.on("mouseover", function(event, d) {
  d3.select(this).select("rect").style("filter", "brightness(1.1)");
}).on("mouseout", function(event, d) {
  d3.select(this).select("rect").style("filter", "brightness(1)");
});