const Category = require('../model/category.model');
const  axios  =require('axios');

const createCategory = async (name) => {
  try {

    const image= await getUnsplashImage(name);
    const newCategory = new Category({ name, image });
    await newCategory.save();
    console.log("Category created successfully:", newCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    throw err;
  }
};


const getUnsplashImage = async (query) => {
  
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const unsplashApi=process.env.UNSPLASH_API;

  const res = await axios.get(unsplashApi, {
    params: { query, per_page: 1 },
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  return res.data.results?.[0]?.urls?.regular || "";
};

module.exports = { createCategory };