// import { Path, Point, view, setup } from "paper";
import * as paper from 'paper';
import { Color, Point } from 'paper';


const begin = () => {

	const canvas: HTMLCanvasElement =
		document.getElementById("myCanvas") as HTMLCanvasElement

	paper.setup(canvas)

	const path = new paper.Path()
	path.strokeColor = new Color(0);

	const start = new paper.Point(100, 100)
	path.moveTo(start)
	path.lineTo(start.add(new Point([200, -50])))
	// paper.view.draw()

}

window.onload = begin
