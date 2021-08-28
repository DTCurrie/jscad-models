const { booleans, primitives, transforms } = require("@jscad/modeling");
const { union } = booleans;
const { cylinder } = primitives;
const { translate } = transforms;

const main = () => {
  /* setup */

  // main params
  const postDiameter = 8;
  const postInsertDiameter = 6;
  const postHeight = 60;
  const insertHeight = 4;

  // creating post

  const post = cylinder({
    height: postHeight,
    radius: postDiameter / 2,
  });

  let postInsert = cylinder({
    height: insertHeight,
    radius: postInsertDiameter / 2,
  });

  postInsert = translate([0, 0, postHeight / 2 + insertHeight / 2], postInsert);

  return union(post, postInsert);
};

module.exports = { main };
