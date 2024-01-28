import React from "react";
import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StopWatch from "./StopWatch";
describe("StopWatch tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("render should match snapshot file", () => {
        const tree = renderer.create(<StopWatch />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("Start and Reset should be enabled while Stop and Lap buttons should be disabled initially", () => {
        render(<StopWatch />);
        expect(screen.getByText("Start")).toBeEnabled();
        expect(screen.getByText("Stop")).toBeDisabled();
        expect(screen.getByText("Lap")).toBeDisabled();
        expect(screen.getByText("Reset")).toBeEnabled();
    });
    it("Start should disable after it is clicked while Stop, and Lap should enable. Reset should remain enabled", () => {
        render(<StopWatch />);
        fireEvent.click(screen.getByText("Start"));
        expect(screen.getByText("Start")).toBeDisabled();
        expect(screen.getByText("Stop")).toBeEnabled();
        expect(screen.getByText("Lap")).toBeEnabled();
        expect(screen.getByText("Reset")).toBeEnabled();
    });
    it("Lap clicked should result in Lap data", () => {
        render(<StopWatch />);
        fireEvent.click(screen.getByText("Start"));
        fireEvent.click(screen.getByText("Lap"));
        expect(screen.getByText("Lap : Time")).toBeInTheDocument();
    });
    it("Start should re-enable after Stop is clicked. Stop should then disable along with Lap. Reset should remain enabled", () => {
        render(<StopWatch />);
        fireEvent.click(screen.getByText("Start"));
        fireEvent.click(screen.getByText("Stop"));
        expect(screen.getByText("Start")).toBeEnabled();
        expect(screen.getByText("Stop")).toBeDisabled();
        expect(screen.getByText("Lap")).toBeDisabled();
        expect(screen.getByText("Reset")).toBeEnabled();
    });
    it("For a stopped state, clicking Reset should result in Start enabled, Stop and Lap should be disabled. Reset should remain enabled. The time should reset to zero and the laps should disappear", () => {
        render(<StopWatch />);
        fireEvent.click(screen.getByText("Reset"));
        expect(screen.getByText("Start")).toBeEnabled();
        expect(screen.getByText("Stop")).toBeDisabled();
        expect(screen.getByText("Lap")).toBeDisabled();
        expect(screen.getByText("Reset")).toBeEnabled();
        expect(screen.getByText("00:00:00.00")).toBeInTheDocument();
    });
    it("For a started state, clicking Reset should result in Start enabled, Stop and Lap should be disabled, Reset should remain enabled. The time should reset to zero and the laps should disappear", () => {
        render(<StopWatch />);
        fireEvent.click(screen.getByText("Start"));
        fireEvent.click(screen.getByText("Reset"));
        expect(screen.getByText("Start")).toBeEnabled();
        expect(screen.getByText("Stop")).toBeDisabled();
        expect(screen.getByText("Lap")).toBeDisabled();
        expect(screen.getByText("Reset")).toBeEnabled();
        expect(screen.getByText("00:00:00.00")).toBeInTheDocument();
    });
    it("setInterval() should be called when start is clicked", () => {
        jest.spyOn(global, "setInterval");
        render(<StopWatch />);
        fireEvent.click(screen.getByText("Start"));
        expect(setInterval).toHaveBeenCalledTimes(1);
    });

    it("clearInterval() should be called when stop is clicked on a started stopwatch", () => {
        jest.spyOn(global, "clearInterval");
        render(<StopWatch />);
        fireEvent.click(screen.getByText("Start"));
        fireEvent.click(screen.getByText("Stop"));
        expect(clearInterval).toHaveBeenCalled();
    });
});