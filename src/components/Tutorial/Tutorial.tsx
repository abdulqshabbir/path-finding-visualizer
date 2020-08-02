import React from "react";
import { Button, Modal } from "semantic-ui-react";

function Tutorial() {
  const [open, setOpen] = React.useState(false);
  const [modalNumber, setModalNumber] = React.useState(1);

  let tutorialMessage = "Use w to create walls!";

  switch (modalNumber) {
    case 1:
      tutorialMessage =
        "Hold down w (lowercase) while hovering the mouse over a grid cell to create walls!" +
        "\n" +
        "All algorithms will try to find a path around the walls!";
      break;
    case 2:
      tutorialMessage =
        "Hold down W (uppercase) while hovering the mouse over a grid cell to remove walls!";
      break;
    case 3:
      tutorialMessage =
        "Hold down e (lowercase) while hovering the mouse over a grid cell to create weights!" +
        "\n" +
        "Dijkstra's algorithm and the A-star algorithm will take the weights into account as they try to find the shortest path!";
      break;
    case 4:
      tutorialMessage = "Use E (uppercase) to removes weights!";
      break;
    case 5:
      tutorialMessage = "That's it!";
      break;
    default:
      tutorialMessage = "That's it!";
      break;
  }

  function finishTutorial() {
    setOpen(false);
    setModalNumber(1);
  }

  return (
    <div className="tutorial-container">
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Show Tutorial</Button>}
      >
        <Modal.Header style={{ fontSize: "30px" }}>Pro-tips!</Modal.Header>
        <Modal.Content>
          <p style={{ fontSize: "20px" }}>{tutorialMessage}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Skip Tutorial
          </Button>
          {modalNumber >= 5 ? (
            <Button color="black" onClick={() => finishTutorial()}>
              Finish!
            </Button>
          ) : (
            <Button
              color="black"
              onClick={() => setModalNumber(modalNumber + 1)}
            >
              {" "}
              Next Tip!
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default Tutorial;
