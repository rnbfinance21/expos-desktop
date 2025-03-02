import Swal from "sweetalert2";
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  width: 450,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default Toast;
