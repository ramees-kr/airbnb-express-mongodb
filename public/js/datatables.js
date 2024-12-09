$(document).ready(function () {
  $("#listingsTable").DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      url: "/Listings/data",
      type: "GET",
    },
    columns: [
      {
        data: "images.picture_url",
        render: function (data, type, row) {
          return `<img src="${data}" alt="${row.name}" width="50" height="50" onerror="this.src='https://via.placeholder.com/300?text=No+Image'"/>`;
        },
      },
      { data: "name" },
      {
        data: "summary",
        render: function (summary, type, row) {
          return summary.length > 60
            ? summary.substring(0, 60) + "..."
            : summary;
        },
      },
      {
        data: "price",
        render: function (data, type, row) {
          const price = data.$numberDecimal ?? data;
          return `$${price}`;
        },
      },
      {
        data: "property_type",
        render: function (data, type, row) {
          return `${data}, ${row.room_type}`;
        },
      },
      {
        data: "listing_url",
        render: function (data) {
          return `<a href="${data}" class="btn btn-outline-light btn-sm shadow-sm" target="_blank">View Details</a>`;
        },
      },
    ],
    order: [[1, "asc"]],
    pageLength: 10,
    initComplete: function () {
      // Apply dark theme styling to the table after DataTable is initialized
      $(".dataTables_wrapper").addClass("bg-dark text-light"); // Dark background for the table container
      $(".dataTables_length, .dataTables_filter").addClass("text-light"); // Style length and filter controls
      $(".dataTables_paginate").addClass("text-light"); // Style pagination controls
      $("thead").addClass("thead-dark"); // Dark header styling
      $(".dataTable").addClass("table-dark table-striped"); // Table dark styling

      // Override alternating row colors to ensure consistent dark theme
      $("#listingsTable tbody tr").addClass("bg-dark text-light"); // Add dark background and light text for all rows
      $("#listingsTable tbody tr.odd").removeClass("odd"); // Remove the default 'odd' class to stop alternating row styles
    },
  });
});
