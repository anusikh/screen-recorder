import React from "react";
import renderer from "react-test-renderer";
import FirebaseLogin from "../components/FirebaseLogin";

test("FirebaseLogin Functionality Snapshot", () => {
  const component = renderer.create(<FirebaseLogin />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  //   tree.props.onClick();
  console.log(tree.children[0].props.onClick);
  tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
