// vue3 composition api

const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    // Reactive data
    const groupedLinks = ref([]);

    // Method to fetch and parse CSV data
    const fetchAndParseCSV = async () => {
      try {
        // Fetch CSV data and parse it into groupedLinks structure
        const response = await fetch('links.csv');
        const csvData = await response.text();

        // Parse CSV data into an array of objects
        const lines = csvData.trim().split('\n');
        const linksData = lines.map(line => {
          const values = line.split(',');
          return {
            category: values[0].trim(),
            link: values[1].trim(),
            title: values[2].trim()
          };
        });

        // Group links by category
        const grouped = {};
        linksData.forEach(link => {
          if (!grouped[link.category]) {
            grouped[link.category] = {
              category: link.category,
              isOpen: false, // Initial state for accordion
              links: []
            };
          }
          grouped[link.category].links.push({
            link: link.link,
            title: link.title
          });
        });

        // Convert object into array and set to groupedLinks
        groupedLinks.value = Object.values(grouped);
        console.log(groupedLinks.value);
      } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
      }
    };

    // Method to toggle accordion
    const toggleAccordion = (categoryData) => {
      // Toggle the isOpen property of the clicked category
      categoryData.isOpen = !categoryData.isOpen;
    };

    // Fetch and parse CSV data when the component is mounted
    onMounted(fetchAndParseCSV);

    return {
      groupedLinks,
      fetchAndParseCSV,
      toggleAccordion
    };
  }
}).mount('#app');
