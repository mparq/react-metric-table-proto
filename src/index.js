import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {$,jQuery} from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import {Dropdown, MenuItem} from 'react-bootstrap';
import _ from 'lodash';
import './index.css';

const allReleases = ['RS1', 'RS2', 'RS3'];
const allPlatforms = ['Mobile', 'Desktop', 'Xbox', 'Holographic'];
const metricTargets = [
    {
        metricname: 'Accessibility Usage (Hours)',
        bucket: 'App Production preview',
        platform: 'Mobile',
        targettype: '>=',
        releaseTargets: [
            {
                release: 'RS1',
                target: 0
            },
            {
                release: 'RS2',
                target: 0
            },
            {
                release: 'RS3',
                target: 0
            }
        ]
    },
    {
        metricname: 'Accessibility Usage (Hours)',
        bucket: 'App Selfhost',
        platform: 'Mobile',
        targettype: '>=',
        releaseTargets: [
            {
                release: 'RS1',
                target: 0
            },
            {
                release: 'RS2',
                target: 0
            },
            {
                release: 'RS3',
                target: 0
            }
        ]
    },
    {
        metricname: 'Accessibility Usage (Hours)',
        bucket: 'Retail',
        platform: 'Mobile',
        targettype: '>=',
        releaseTargets: [
            {
                release: 'RS1',
                target: 0
            },
            {
                release: 'RS2',
                target: 0
            },
            {
                release: 'RS3',
                target: 0
            }
        ]
    },
    {
        metricname: 'Active Device Count',
        bucket: 'App Selfhost',
        platform: 'Mobile',
        targettype: '>=',
        releaseTargets: [
            {
                release: 'RS1',
                target: 2000
            },
            {
                release: 'RS2',
                target: 5000 
            },
            {
                release: 'RS3',
                target: 10000
            }
        ]
    },
    {
        metricname: 'Active Device Count',
        bucket: 'Retail',
        platform: 'Mobile',
        targettype: '>=',
        releaseTargets: [
            {
                release: 'RS1',
                target: 4
            },
            {
                release: 'RS2',
                target: 1230
            },
            {
                release: 'RS3',
                target: 2000
            }
        ]
    },
];

function PlatformDropdown(props) {
    const platforms = props.platforms;
    const options = platforms.map((platform) =>
        <option key={platform} value={platform}>{platform}</option>
    );
    const handleChange = (event) => {
        props.onPlatformSelected(event.target.value)
    }
    return (
        <div >
            <span>Platform: </span>
            <select value={props.selectedPlatform} onChange={handleChange}>
                {options}
            </select>
        </div>
    );
}

function ReleaseDropdown(props) {
    const selectedReleases = props.selectedReleases;
    const releases = props.releases;
    const handleSelect = (eventKey, event) => {
        props.onReleaseSelected(eventKey);
        event.preventDefault();
    }
    const options = releases.map((release, index) =>
        <MenuItem
                key={release}
                active={_.includes(selectedReleases, release)}
                eventKey={release}
                onSelect={handleSelect}>
            {release}
        </MenuItem>
    );
    const dropdownToggleText = selectedReleases.length > 1 ?
        selectedReleases.length + ' selected'
        : selectedReleases.length === 1 ?
            selectedReleases[0]
            : 'None selected';

    return (
        // <select value={releases[0]} onChange={props.onChange}>
        //     {options}
        // </select>
        <div>
            <span id="release-dropdown-label">Release: </span>
            <Dropdown id="release-dropdown">
                <Dropdown.Toggle>
                    {dropdownToggleText}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {options}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

function TargetTypeDropdown(props) {
    const targettypes = props.targettypes;
    const options = targettypes.map((targettype) =>
        <option key={targettype} value={targettype}>{targettype}</option>
    );
    return (
        <select className={props.className} value={props.selected} onChange={props.onChange}>
            {options}
        </select>
    );
}

function TargetTypeInput(props) {
    return (
        <div className="hover-switch-container">
            <span className="hide-on-hover">{props.targettype}</span>
            <TargetTypeDropdown className="show-on-hover" selected={props.targettype} targettypes={props.targettypes} onChange={props.onChange} />
        </div>
    )
}

function ReleaseTargetInput(props) {
    const handleChange = (e) => {
        props.onTargetChange(props.release, e.target.value);
    }
    return (
        <div className="hover-switch-container">
            <span className="hide-on-hover">{props.target}</span>
            <input className="show-on-hover" value={props.target} onChange={handleChange} />
        </div>
    )
}

class MetricTargetRow extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleTargetChange = this.handleTargetChange.bind(this);
    }

    handleChange(e) {
        this.props.onTargetTypeChange(this.props.bucket, e.target.value);
    }

    handleTargetChange(release, target) {
        this.props.onTargetChange(this.props.bucket, release, target);
    }

    render() {
        const selectedReleases = this.props.selectedReleases;
        const releaseTargets = this.props.releaseTargets;
        const displayedReleases = _.filter(releaseTargets, (releaseTarget) =>
            _.includes(selectedReleases, releaseTarget.release)
        ).map((releaseTarget) =>
            <div key={releaseTarget.release} className="col-sm-2">
                <ReleaseTargetInput release={releaseTarget.release} target={releaseTarget.target} onTargetChange={this.handleTargetChange} />
            </div>
        );
        return (
            <div key={this.props.bucket} className="row">
                <div className="col-sm-4">
                    {this.props.bucket}
                </div>
                <div className="col-sm-2">
                    <TargetTypeInput targettype={this.props.targettype} targettypes={this.props.targettypes} onChange={this.handleChange}/>
                </div>
                {
                    displayedReleases
                }
            </div>
        );
    }
}

const possibleTargetTypes = ['>=', '>', '=', '<>', '<=', '<'];
class Metric extends Component {
    constructor(props) {
        super(props);
        this.handleTargetTypeChange = this.handleTargetTypeChange.bind(this);
        this.handleTargetChange = this.handleTargetChange.bind(this);
    }

    handleTargetTypeChange(bucket, targettype) {
        this.props.onMetricTargetTypeChange(this.props.metric, bucket, targettype);
    }

    handleTargetChange(bucket, release, target) {
        this.props.onMetricTargetChange(this.props.metric, bucket, release, target);
    }

    render() {
        const metricTargets = this.props.metricTargets;
        const metricTargetRows = metricTargets.map((metricTarget, index) =>
            // MetricTargetRow({
            //     bucket: metricTarget.bucket,
            //     targettype: metricTarget.targettype,
            //     targettypes: possibleTargetTypes,
            //     releaseTargets: metricTarget.releaseTargets,
            //     selectedReleases: this.props.selectedReleases
            // })
            <MetricTargetRow
                key={metricTarget.bucket}
                bucket={metricTarget.bucket}
                targettype={metricTarget.targettype}
                targettypes={possibleTargetTypes}
                releaseTargets={metricTarget.releaseTargets}
                selectedReleases={this.props.selectedReleases}
                onTargetChange={this.handleTargetChange}
                onTargetTypeChange={this.handleTargetTypeChange} />
        );
        return (
            <div className="row">
                <div className="col-sm-4">
                    {this.props.metric}
                </div>
                <div className="col-sm-8">
                    {metricTargetRows}
                </div>
            </div>
        );
    }
}

function MetricTargetHeader(props) {
    const selectedReleases = props.selectedReleases;
    const displayedReleases = allReleases.filter((release) =>
        _.includes(selectedReleases, release)
    ).map((release) =>
        <div key={release} className="col-sm-2">
            {release}
        </div>
    );
    return (
        <div className="row">
            <div className="col-sm-4">
                Bucket
            </div>
            <div className="col-sm-2">
                Target Type    
            </div>
            {displayedReleases}
        </div>
    );
}
function MetricHeader(props) {
    return (
        <div className="row">
            <div className="col-sm-4">
                Metric Name
            </div> 
            <div className="col-sm-8">
                <MetricTargetHeader selectedReleases={props.selectedReleases} />
            </div>
        </div>
    );
}
class MetricTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metricTargets: props.metricTargets,
            selectedPlatform: 'Mobile',
            selectedReleases: allReleases
        };
        
        this.handleMetricTargetChange = this.handleMetricTargetChange.bind(this);
        this.handleMetricTargetTypeChange = this.handleMetricTargetTypeChange.bind(this);
        this.handlePlatformSelected = this.handlePlatformSelected.bind(this);
        this.handleReleaseSelected = this.handleReleaseSelected.bind(this);
    }

    getGroupedMetricTargets(metricTargets, selectedPlatform) {
        return _.chain(metricTargets)
            .filter({platform: selectedPlatform})
            .groupBy((metricTarget) => metricTarget.metricname)
            .value();
    }

    handleMetricTargetTypeChange(metric, bucket, targettype) {
        const metricTargets = this.state.metricTargets.slice();
        const groupedMetricTargets = this.getGroupedMetricTargets(metricTargets, this.state.selectedPlatform);
        _.find(groupedMetricTargets[metric], {bucket: bucket}).targettype = targettype
        this.setState({
            metricTargets: metricTargets
        });
    }

    handleMetricTargetChange(metric, bucket, release, target) {
        const metricTargets = this.state.metricTargets.slice();
        const groupedMetricTargets = this.getGroupedMetricTargets(metricTargets, this.state.selectedPlatform);
        _.find(
            _.find(groupedMetricTargets[metric], {bucket: bucket}).releaseTargets,
            {release: release}
        ).target = target;
        this.setState({
            metricTargets: metricTargets
        });
    }

    handlePlatformSelected(selectedPlatform) {
        this.setState({
            selectedPlatform: selectedPlatform
        });
    }

    handleReleaseSelected(selectedRelease) {
        let selectedReleases = this.state.selectedReleases;
        if (_.includes(selectedReleases, selectedRelease)) {
            selectedReleases = _.filter(selectedReleases, function (release) { return release !== selectedRelease });
        }
        else {
            // order here doesn't matter since it is just used to check which releases in allReleases are selected
            selectedReleases.push(selectedRelease);
        }
        this.setState({
            selectedReleases: selectedReleases
        });
    }

    render() {
        const selectedPlatform = this.state.selectedPlatform;
        const groupedMetricTargets = this.getGroupedMetricTargets(this.state.metricTargets, selectedPlatform);
        const selectedReleases = this.state.selectedReleases;

        const groupedMetrics =
            Object.keys(groupedMetricTargets)
                .sort()  // sort metrics in alphabetical order
                .map((key) =>
                    <Metric
                        key={key}
                        metric={key}
                        metricTargets={groupedMetricTargets[key]}
                        selectedReleases={selectedReleases}
                        onMetricTargetChange={this.handleMetricTargetChange}
                        onMetricTargetTypeChange={this.handleMetricTargetTypeChange} />
                );
        return (
            <div id="metric-table" className="container-fluid">
                <MetricTableControls
                    selectedPlatform={selectedPlatform}
                    platforms={allPlatforms}
                    onPlatformSelected={this.handlePlatformSelected}
                    selectedReleases={selectedReleases}
                    releases={allReleases}
                    onReleaseSelected={this.handleReleaseSelected} />
                <MetricHeader selectedReleases={selectedReleases} />
                {groupedMetrics}
            </div>
        );
    }
}
function MetricTableControls(props) {
    return (
        <div className="row">
            <div className="col-sm-4">
                <PlatformDropdown
                    selectedPlatform={props.selectedPlatform}
                    platforms={props.platforms}
                    onPlatformSelected={props.onPlatformSelected} />
            </div>
            <div className="col-sm-8">
                <ReleaseDropdown
                    selectedReleases={props.selectedReleases}
                    releases={props.releases}
                    onReleaseSelected={props.onReleaseSelected} />
            </div>
        </div>
    )
}
// should be array of metrics and target types
// metricname, bucket, release, platform, targettype, target
ReactDOM.render(
    <MetricTable metricTargets={metricTargets} />,
    document.getElementById('root')
);
