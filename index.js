const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    const countyData = topojson.feature(data, data.objects.counties).features;
    console.log(countyData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        const educationData = data;
        console.log(educationData);

        const width = 1000;
        const height = 600;
        const padding = 60;

        const svg = d3
          .select("body")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        svg
          .selectAll("path")
          .data(countyData)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("class", "county")
          .attr("fill", (d) => {
            const id = d.id;
            const county = educationData.find((item) => {
              return item.fips === id;
            });
            const percentage = county.bachelorsOrHigher;
            if (percentage <= 15) {
              return "tomato";
            } else if (percentage <= 30) {
              return "orange";
            } else if (percentage <= 45) {
              return "lightgreen";
            } else {
              return "limegreen";
            }
          })
          .attr("data-fips", (d) => d.id)
          .attr("data-education", (d) => {
            const id = d.id;
            const county = educationData.find((item) => {
              return item.fips === id;
            });
            const percentage = county.bachelorsOrHigher;
            return percentage;
          })

          .on("mousemove", function (e, d) {
            const tooltip = d3.select("#tooltip");
            const id = d.id;
            const county = educationData.find((item) => {
              return item.fips === id;
            });

            tooltip
              .style("opacity", 0.9)
              .style("left", e.pageX + 10 + "px")
              .style("top", e.pageY + 10 + "px")
              .style("font-size", "15px");

            tooltip
              .attr('data-education', (d) => county.bachelorsOrHigher)
              .html(
                `${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%`
              );
          })

          .on("mouseout", function (e) {
            d3.select("#tooltip").style("opacity", 0);
          });

        const tooltip = d3
          .select("body")
          .append("div")
          .attr("id", "tooltip")
          .style("opacity", "0")
          .style("position", "absolute")
          .style("background-color", "rgba(0, 0, 0, 0.8")
          .style("color", "#fff")
          .style("padding", "10px");
      }
    });
  }
});
