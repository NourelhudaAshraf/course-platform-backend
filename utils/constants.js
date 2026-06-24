const coursePop = {
  path: "course",
  select: "title price description image user",
  populate: {
    path: "user",
    select: "name",
  },
};

module.exports = {
  coursePop,
};
