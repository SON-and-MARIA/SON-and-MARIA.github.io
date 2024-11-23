// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcQJn4IPwSsglUp_vbNa8t6SGiDvXjJDE",
  authDomain: "maria-and-brody.firebaseapp.com",
  projectId: "maria-and-brody",
  storageBucket: "maria-and-brody.firebasestorage.app",
  messagingSenderId: "359868109799",
  appId: "1:359868109799:web:122e509fe4b8b56787a342",
  measurementId: "G-VZGFGEEECV"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// Initialize Firestore
const firestore = firebase.firestore();

// Function to automatically load data from Firestore
function loadData() {
  getUsedYearsFromFirestore().then((data) => {
      // Load data for Maria and Brody
      if (data.maria.length > 0 && data.brody.length > 0) {
          const latestMaria = data.maria[data.maria.length - 1];
          const latestBrody = data.brody[data.brody.length - 1];

          // Update the columns with the loaded data
          updateColumn("yearMaria", "regionMaria", "questionsMaria", latestMaria.year, latestMaria.region, latestMaria.questions);
          updateColumn("yearBrody", "regionBrody", "questionsBrody", latestBrody.year, latestBrody.region, latestBrody.questions);
      }
  });
}

// Function to check if a week has passed since the last generation
function canGenerateNewData(data) {
  if (data.maria.length === 0 || data.brody.length === 0) {
      return true; // No data, so we can generate
  }

  const lastTimestamp = data.maria[data.maria.length - 1].timestamp.toDate();
  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();

  return (now - lastTimestamp) >= oneWeekInMillis;
}

// Function to generate new year and questions
function generateData() {
  getUsedYearsFromFirestore().then((data) => {
      // Ensure data.maria and data.brody are arrays
      data.maria = Array.isArray(data.maria) ? data.maria : [];
      data.brody = Array.isArray(data.brody) ? data.brody : [];

      if (!canGenerateNewData(data)) {
          alert("You can only generate new data once per week.");
          return;
      }

      let yearMaria = getRandomYear(1975, new Date().getFullYear(), data.maria.map(item => item.year));
      let yearBrody = getRandomYear(2014, new Date().getFullYear(), data.brody.map(item => item.year));

      // Generate the region and questions based on the year
      let regionMaria = getRandomRegion();
      let regionBrody = getRandomRegion();
      
      let questionsMaria = generateUniqueQuestions(yearMaria, data.maria);
      let questionsBrody = generateUniqueQuestions(yearBrody, data.brody);
      
      // Update the columns with the generated data
      updateColumn("yearMaria", "regionMaria", "questionsMaria", yearMaria, regionMaria, questionsMaria);
      updateColumn("yearBrody", "regionBrody", "questionsBrody", yearBrody, regionBrody, questionsBrody);
      
      // Save the updated years, regions, and questions to Firestore
      saveUsedYearsToFirestore(yearMaria, regionMaria, questionsMaria, yearBrody, regionBrody, questionsBrody);
  });
}

// Function to generate random year between min and max, excluding used years
function getRandomYear(min, max, usedYears) {
  let year;
  do {
      year = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (usedYears.includes(year));
  return year;
}

// Function to generate random region (e.g., America, Portuguese, Australian)
function getRandomRegion() {
  const regions = ['America', 'Portuguese', 'Australian'];
  return regions[Math.floor(Math.random() * regions.length)];
}

// Function to generate unique questions based on the year
function generateUniqueQuestions(year, usedData) {
  const questionsList = [
    'What was the movie of the year in ${year}?',
    'What was the top TV show of the year in ${year}?',
    'What music was popular in ${year}?',
    'What was the top video game of the year in ${year}?',
    'What was the popular book of the year in ${year}?',
    'What was the best-selling toy of the year in ${year}?',
    'What was the top meme or internet trend in ${year}?',
    'What was the most popular podcast or radio show in ${year}?',
    'What was the most-watched YouTube video of the year in ${year}?',
    'What was the top celebrity scandal or event in ${year}?',
    'What was the top fashion trend of the year in ${year}?',
    'What was the most popular haircut or hairstyle in ${year}?',
    'What was the iconic dance of the year in ${year}?',
    'What was the popular slang word or phrase in ${year}?',
    'What was the best-selling magazine or comic in ${year}?',
    'What was the famous festival or cultural celebration of the year in ${year}?',
    'What was the trending DIY craft or hobby of the year in ${year}?',
    'What was the most popular workout or fitness trend in ${year}?',
    'What was the popular board game of the year in ${year}?',
    'What was the top decoration or design trend in ${year}?',
    'What was the history of the day you were born in ${year}?',
    'What was the cool fact of the year in ${year}?',
    'What was the major political event of the year in ${year}?',
    'What was the world record of the year in ${year}?',
    'What was the significant scientific discovery of the year in ${year}?',
    'What was the invention or technology breakthrough of the year in ${year}?',
    'What was the biggest news story of the year in ${year}?',
    'What was the famous birth or death of the year in ${year}?',
    'What was the major weather or natural event in ${year}?',
    'What was the world population size of the year in ${year}?',
    'What was the top food trend of the year in ${year}?',
    'What was the most popular snack or junk food in ${year}?',
    'What was the best-selling beverage of the year in ${year}?',
    'What was the famous recipe or dish of the year in ${year}?',
    'What was the top new restaurant chain of the year in ${year}?',
    'What was the most popular candy or sweet treat in ${year}?',
    'What was the most consumed alcoholic beverage in ${year}?',
    'What was the favorite local dish from where you were born in ${year}?',
    'What was the global food innovation of the year in ${year}?',
    'What was the iconic fast food item of the year in ${year}?',
    'What was the sports highlight of the year in ${year}?',
    'What was the most-watched sporting event of the year in ${year}?',
    'What was the Olympics highlight in ${year}?',
    'What was the most popular athlete of the year in ${year}?',
    'What was the top extreme sport or challenge trend in ${year}?',
    'What was the cool fact of the day you were born in ${year}?',
    'What was the cool fact from where you were born in ${year}?',
    'What was the most popular name of the year in ${year}?',
    'What was the cost of living during the year you were born in ${year}?',
    'What was the top travel destination of the year in ${year}?',
    'What was the most popular social media platform in ${year}?',
    'What was the most successful crowdfunding campaign of the year in ${year}?',
    'What was the most controversial news story in ${year}?',
    'What was the top streaming service of the year in ${year}?',
    'What was the most downloaded mobile app in ${year}?',
    'What was the most popular fitness challenge of the year in ${year}?',
    'What was the biggest tech product launch of the year in ${year}?',
    'What was the most popular online course or learning platform in ${year}?',
    'What was the biggest environmental change in ${year}?',
    'What was the most popular charity event of the year in ${year}?',
    'What was the most viral video of the year in ${year}?',
    'What was the biggest political shift in ${year}?',
    'What was the top home appliance trend in ${year}?',
    'What was the most popular vacation spot in ${year}?',
    'What was the most significant humanitarian event of the year in ${year}?',
    'What was the most popular beauty product of the year in ${year}?',
    'What was the most popular game show of the year in ${year}?',
    'What was the most popular mobile game in ${year}?',
    'What was the most successful celebrity collaboration in ${year}?',
    'What was the most popular online meme of the year in ${year}?',
    'What was the most popular theme park in ${year}?',
    'What was the most popular hobby in ${year}?',
    'What was the top breakthrough in medical science in ${year}?',
    'What was the most popular craft beer in ${year}?',
    'What was the top DIY home improvement trend in ${year}?',
    'What was the most popular electronic gadget of the year in ${year}?',
    'What was the top digital marketing trend in ${year}?',
    'What was the most significant social media campaign of the year in ${year}?',
    'What was the most popular dance challenge in ${year}?',
    'What was the most popular art movement in ${year}?',
    'What was the most famous viral challenge of the year in ${year}?',
    'What was the most popular recipe trend in ${year}?',
    'What was the most popular subscription box of the year in ${year}?',
    'What was the most popular virtual reality experience in ${year}?',
    'What was the most popular alternative medicine treatment in ${year}?',
    'What was the most successful charity campaign in ${year}?',
    'What was the most popular cryptocurrency in ${year}?',
    'What was the most popular plant or gardening trend in ${year}?',
    'What was the most popular international holiday destination in ${year}?',
    'What was the most successful video game franchise of the year in ${year}?',
    'What was the most popular blog or influencer of the year in ${year}?',
    'What was the most popular tech gadget released in ${year}?',
    'What was the most popular new app for social networking in ${year}?',
    'What was the biggest celebrity couple of the year in ${year}?',
    'What was the most popular podcast genre in ${year}?',
    'What was the biggest celebrity endorsement of the year in ${year}?',
    'What was the most popular celebrity interview in ${year}?',
    'What was the most popular clothing brand of the year in ${year}?',
    'What was the biggest social media trend of the year in ${year}?',
    'What was the most popular toy brand of the year in ${year}?',
    'What was the most popular toy for adults in ${year}?',
    'What was the biggest breakthrough in AI technology in ${year}?',
    'What was the top global fashion event in ${year}?',
    'What was the most famous award show moment of the year in ${year}?',
    'What was the top environmental movement in ${year}?',
    'What was the biggest controversy in sports in ${year}?',
    'What was the biggest sports achievement in ${year}?',
    'What was the most popular tech startup of the year in ${year}?',
    'What was the most popular fitness influencer of the year in ${year}?',
    'What was the most popular energy drink of the year in ${year}?',
    'What was the most famous street art of the year in ${year}?',
    'What was the most iconic viral campaign in ${year}?',
    'What was the top smartphone brand of the year in ${year}?',
    'What was the biggest technology trend in ${year}?',
    'What was the most popular online store in ${year}?',
    'What was the top fashion designer of the year in ${year}?',
    'What was the most popular reality TV show of the year in ${year}?',
    'What was the most popular tech gadget of the year in ${year}?',
    'What was the most downloaded song of the year in ${year}?',
    'What was the best-selling car model of the year in ${year}?',
    'What was the most watched documentary of the year in ${year}?',
    'What was the top news source in ${year}?',
    'What was the most popular video streaming service in ${year}?',
    'What was the most viral tweet of the year in ${year}?',
    'What was the most popular e-commerce trend in ${year}?',
    'What was the most influential person in tech in ${year}?',
    'What was the biggest movie flop of the year in ${year}?',
    'What was the most popular wedding trend in ${year}?',
    'What was the most iconic building or structure built in ${year}?',
    'What was the most popular concert tour of the year in ${year}?',
    'What was the most popular social media challenge of the year in ${year}?',
    'What was the most popular health trend of the year in ${year}?',
    'What was the most popular wedding dress style of the year in ${year}?',
    'What was the most talked about political leader in ${year}?',
    'What was the biggest fashion collaboration of the year in ${year}?',
    'What was the top selling video game console of the year in ${year}?',
    'What was the most innovative startup of the year in ${year}?',
    'What was the biggest online shopping event in ${year}?',
    'What was the top music festival of the year in ${year}?',
    'What was the most watched reality TV episode in ${year}?',
    'What was the most streamed podcast of the year in ${year}?',
    'What was the top e-sport event of the year in ${year}?',
    'What was the most viral meme in ${year}?',
    'What was the most popular craft beer of the year in ${year}?',
    'What was the most iconic art piece of the year in ${year}?',
    'What was the biggest tech conference in ${year}?',
    'What was the most popular alternative lifestyle trend in ${year}?',
    'What was the most popular celebrity collaboration in fashion in ${year}?',
    'What was the top fashion accessory of the year in ${year}?',
    'What was the most successful TV reboot in ${year}?',
    'What was the top subscription service in ${year}?',
    'What was the most popular gaming accessory in ${year}?',
    'What was the most watched sporting event in ${year}?',
    'What was the most successful crowdfunding project in ${year}?',
    'What was the most popular AI application in ${year}?',
    'What was the most popular virtual event of the year in ${year}?',
    'What was the most popular indoor activity of the year in ${year}?',
    'What was the most popular pet trend in ${year}?',
    'What was the most successful social media influencer campaign in ${year}?',
    'What was the most popular home improvement trend in ${year}?',
    'What was the most popular gardening trend in ${year}?',
    'What was the top-rated Netflix original series in ${year}?',
    'What was the most popular smartphone app in ${year}?',
    'What was the most popular vegetarian or vegan dish in ${year}?',
    'What was the most popular vegan product of the year in ${year}?',
    'What was the most popular workout app in ${year}?',
    'What was the top news story on social media in ${year}?',
    'What was the most-watched live stream event in ${year}?',
    'What was the most popular book genre in ${year}?',
    'What was the most downloaded mobile game in ${year}?',
    'What was the top destination for a vacation in ${year}?',
    'What was the most popular video editing software in ${year}?',
    'What was the most popular educational YouTube channel in ${year}?',
    'What was the most innovative advertising campaign in ${year}?',
    'What was the most popular social media hashtag in ${year}?',
    'What was the most famous brand ambassador in ${year}?',
    'What was the top TikTok trend in ${year}?',
    'What was the most successful independent film in ${year}?',
    'What was the most innovative fashion technology of the year in ${year}?',
    'What was the biggest political controversy of the year in ${year}?',
    'What was the most popular self-care routine of the year in ${year}?',
    'What was the most talked-about historical event of the year in ${year}?',
    'What was the most popular place to eat out in ${year}?',
    'What was the top-rated video game release in ${year}?',
    'What was the biggest music award ceremony in ${year}?',
    'What was the most popular collectible item in ${year}?',
    'What was the most popular documentary film in ${year}?',
    'What was the most popular tech gadget in the smart home category in ${year}?',
    'What was the top health or wellness app in ${year}?',
    'What was the most popular facial treatment or skincare product in ${year}?',
    'What was the most talked about celebrity wedding in ${year}?',
    'What was the top news outlet in ${year}?',
    'What was the most popular team sport in ${year}?',
    'What was the most watched late-night show episode in ${year}?',
    'What was the top-rated reality show in ${year}?',
    'What was the most popular environmental initiative in ${year}?',
    'What was the most talked about invention in ${year}?',
    'What was the most popular kitchen gadget in ${year}?',
    'What was the most popular home decor trend in ${year}?',
    'What was the most popular local festival in ${year}?',
    'What was the most popular fitness class in ${year}?',
    'What was the most popular snack at sporting events in ${year}?',
    'What was the top travel blog of the year in ${year}?',
    'What was the most popular educational platform in ${year}?',
    'What was the most successful online marketplace in ${year}?',
    'What was the top vacation destination for families in ${year}?',
    'What was the most popular digital currency in ${year}?',
    'What was the most popular hobby in the tech community in ${year}?',
    'What was the top toy release for kids in ${year}?',
    'What was the most popular video game genre in ${year}?',
    'What was the most downloaded fitness tracker app in ${year}?',
    'What was the top tech invention for work in ${year}?',
    'What was the most popular platform for online learning in ${year}?',
    'What was the most popular fantasy sports platform in ${year}?',
    'What was the most popular way to stream live events in ${year}?',
    'What was the most popular snack for gaming in ${year}?',
    'What was the most popular streaming documentary in ${year}?',
    'What was the most successful celebrity podcast in ${year}?',
    'What was the most popular home workout equipment in ${year}?',
    'What was the most talked about sports controversy in ${year}?',
    'What was the most popular luxury car model in ${year}?',
    'What was the most popular trend in fashion for men in ${year}?',
    'What was the most popular makeup trend of the year in ${year}?',
    'What was the most successful online campaign in ${year}?',
    'What was the most popular historical documentary in ${year}?',
    'What was the most downloaded language-learning app in ${year}?',
    'What was the most popular electronic gadget for entertainment in ${year}?',
    'What was the top-rated podcast on technology in ${year}?',
    'What was the top recipe trend for cooking at home in ${year}?',
    'What was the most popular online platform for socializing in ${year}?',
    'What was the most popular app for fitness tracking in ${year}?',
    'What was the most popular celebrity endorsement in ${year}?',
    'What was the most popular mobile phone in ${year}?',
    'What was the most famous wedding dress designer in ${year}?',
    'What was the most popular website for video content in ${year}?',
    'What was the most popular event for fashion enthusiasts in ${year}?',
    'What was the top-performing influencer campaign in ${year}?',
    'What was the most popular sport for kids in ${year}?',
    'What was the most successful fitness transformation story in ${year}?',
    'What was the most talked about scientific achievement in ${year}?'
  
  ];

  // Find previous questions for the same year if any
  const previousQuestions = usedData.filter(item => item.year === year).map(item => item.questions).flat();

  // Filter out previously used questions
  const availableQuestions = questionsList.filter(question => !previousQuestions.includes(question));

  // Randomly select 3 unique questions
  let selectedQuestions = [];
  while (selectedQuestions.length < 3) {
      const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      if (!selectedQuestions.includes(question)) {
          selectedQuestions.push(question);
      }
  }

  return selectedQuestions;
}

// Function to update the columns in your HTML with the generated data
function updateColumn(yearId, regionId, questionsId, year, region, questions) {
  document.getElementById(yearId).textContent = year;
  document.getElementById(regionId).textContent = region;
  document.getElementById(questionsId).innerHTML = questions.map(q => `<li>${q}</li>`).join('');
}

// Function to retrieve used years, regions, and questions from Firestore
function getUsedYearsFromFirestore() {
  return new Promise((resolve) => {
      firestore.collection('usedYears').doc('mariaAndBrody').get().then((doc) => {
          if (doc.exists) {
              resolve(doc.data());
          } else {
              // If no data exists, return empty arrays
              resolve({ maria: [], brody: [] });
          }
      });
  });
}

// Function to save used years, regions, and questions to Firestore
function saveUsedYearsToFirestore(yearMaria, regionMaria, questionsMaria, yearBrody, regionBrody, questionsBrody) {
  // Fetch the current used years from Firestore
  getUsedYearsFromFirestore().then((data) => {
      // Ensure data.maria and data.brody are arrays
      data.maria = Array.isArray(data.maria) ? data.maria : [];
      data.brody = Array.isArray(data.brody) ? data.brody : [];

      const timestamp = new Date();

      data.maria.push({ year: yearMaria, region: regionMaria, questions: questionsMaria, timestamp: timestamp });
      data.brody.push({ year: yearBrody, region: regionBrody, questions: questionsBrody, timestamp: timestamp });

      // Save the updated data back to Firestore
      firestore.collection('usedYears').doc('mariaAndBrody').set(data)
          .then(() => {
              console.log("Used years, regions, and questions updated successfully!");
          })
          .catch((error) => {
              console.error("Error updating used years: ", error);
          });
  });
}

// Automatically load data on page load
document.addEventListener('DOMContentLoaded', loadData);
