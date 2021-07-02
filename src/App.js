import React from 'react';
import './App.css';

function TileImg(props) {
  //const tileX = props.tileX
  //const tileY = props.tileY

  let tileRegion = props.tileRegion

  // tileRegion is a bitset generated by genTileRegion of TileEditor
  // so, each bit marks the presence of active or inactive neighbor tiles:
  //
  // bitset: 0b3210
  // matrix (center is ignored):
  // [   0
  //  1     2
  //     3   ],
  //
  // For each combination of tiles, there is one right tile, this is how
  // auto-tiling works :D
  //
  // that said, the `autoTilerMap` variable maps each tileRegion combination with an array, this array
  // contains two entries, which is tileX and tileY.

  // note: the order that I added the entries here is from the tileset, from upper-left, left-to-right.
  const autoTilerMap = new Array(16).fill([0, 0]);

  // first line of tileset
  //             b3210     x  y
  autoTilerMap.[0b0000] = [0, 0];
  autoTilerMap.[0b0100] = [1, 0];
  autoTilerMap.[0b0110] = [2, 0];
  autoTilerMap.[0b0010] = [3, 0];

  // second line of tileset
  //             b3210     x  y
  autoTilerMap.[0b1000] = [0, 1];
  autoTilerMap.[0b1100] = [1, 1];
  autoTilerMap.[0b1110] = [2, 1];
  autoTilerMap.[0b1010] = [3, 1];

  // third line of tileset
  //             b3210     x  y
  autoTilerMap.[0b1001] = [0, 2];
  autoTilerMap.[0b1101] = [1, 2];
  autoTilerMap.[0b1111] = [2, 2];
  autoTilerMap.[0b1011] = [3, 2];

  // fourth line of tileset
  //             b3210     x  y
  autoTilerMap.[0b0001] = [0, 3];
  autoTilerMap.[0b0101] = [1, 3];
  autoTilerMap.[0b0111] = [2, 3];
  autoTilerMap.[0b0011] = [3, 3];

  let tileXY = autoTilerMap[tileRegion];

  let tileX = tileXY[0];
  let tileY = tileXY[1];

  const x = -18 * tileX;
  const y = -18 * tileY;

  const inline_style = {
    backgroundImage: "url('tileset.png')",
    backgroundPosition: `${x}px ${y}px`,
  }

  return (
    <div className="tileImg" style={props.isActive ? inline_style : {}}>
    </div>
  );
}

function TileButton(props) {
  return (
    <button className={"tile_button" + (props.isActive ? " active_tile" : "") } onClick={() => props.onClick(props.tileIndex)}>
      {props.tileIndex}
    </button>
  );
}

class TileEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: Array(50).fill(false),
    };

    this.handleClick = this.handleClick.bind(this);
    this.genTileRegion = this.genTileRegion.bind(this);
  }

  genTileRegion(i) {
    let map = this.state.map;

    // first, create a 3x3 matrix as an array of 8 entries (because is ignoring `i`'s tile)
    // [   0,
    //  1,    2,
    //     3   ],
    let arrTileRegion = Array(4).fill(false);

    arrTileRegion[0] = i - 10 >= 0 ? map[i - 10] : false;
    arrTileRegion[1] = i -  1 >= 0 ? map[i -  1] : false;

    arrTileRegion[2] = i +  1 < map.length ? map[i +  1] : false;
    arrTileRegion[3] = i + 10 < map.length ? map[i + 10] : false;

    // handle map boundaries]
    switch (i % 10) {
      case 0: arrTileRegion[1] = false; break; // left boundary, overwrite left tile as "no-tile"
      case 9: arrTileRegion[2] = false; break; // right boundary, overwrite right tile as "no-tile"
    }

    let tileRegion = 0;

    // then, convert the array (matrix) to a bitset: 0b3210
    for (let x = 0; x < 4; x++)
      tileRegion = tileRegion | ((arrTileRegion[x] ? 1 : 0) << x);

    return tileRegion;
  }

  handleClick(tileIndex) {
    let map = this.state.map.slice();
    map[tileIndex] = !map[tileIndex];
    this.setState({map: map})
  }

  render() {
    let tileEditor = [];
    let tileMap = [];

    let map = this.state.map;
    for (let i = 0; i < 50; i++) {
      let curTile = map[i];

      let tileRegion = this.genTileRegion(i);

      tileEditor.push(<TileButton tileIndex={i} onClick={this.handleClick} isActive={curTile} key={i} />);

      tileMap.push(<TileImg key={i} isActive={curTile} tileRegion={tileRegion} tileIndex={i} />);

      if (i % 10 === 9) {
        tileEditor.push(<br key={i + "_TE_br"}/>);
        tileMap.push(<br key={i + "_TM_br"}/>);
      }
    }

    return (
      <div id="tile_editor">
        <div className="tile_editor_pannel" id="tile_editor_buttons">
          {tileEditor}
        </div>
        <div className="tile_editor_pannel" id="tile_editor_preview">
          {tileMap}
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <main>
        <h1>Autotiler toy<br/>simple autotiling and React experiment</h1>
        <p>
          Made by <a href="https://github.com/Andre-LA/">André Luiz Alvares</a><br/>
          see <a href="https://github.com/Andre-LA/my-autotiler-toy">source code</a>.<br/>
          <a href="https://www.kenney.nl/assets/pixel-platformer">Tileset made by Kenney</a>.
        </p>
        <TileEditor />
      </main>
    </div>
  );
}

export default App;
